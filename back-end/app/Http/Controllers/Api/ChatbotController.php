<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use RuntimeException;

use App\Services\GeminiService;

use App\Models\Shipment;
use App\Models\ShipmentService;
use App\Models\ShipmentStatus;
use App\Models\Tracking;
use App\Models\Branch;
use App\Models\Bill;

use Illuminate\Database\Eloquent\Collection;

class ChatbotController extends Controller
{
    protected GeminiService $gemini;
    protected string $systemPrompt;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;

        $this->systemPrompt = <<<PROMPT
Bạn là **Chatbot hỗ trợ Dịch vụ Giao nhận (Courier Service)**.

QUY TẮC BẮT BUỘC:
- Chỉ trả lời dựa trên dữ liệu từ hệ thống giao nhận tôi cung cấp (đơn hàng, vận đơn, dịch vụ, chi nhánh, thanh toán).
- Không suy đoán, không bịa trạng thái, không hứa hẹn ngoài dữ liệu.
- Nếu không có dữ liệu → trả lời rõ ràng là "hiện chưa có thông tin".
- Trả lời ngắn gọn, rõ ràng, dễ hiểu.

NHIỆM VỤ:
- Tra cứu vận đơn (tracking number)
- Giải thích trạng thái giao hàng
- Tư vấn dịch vụ vận chuyển
- Hướng dẫn thanh toán (COD / MoMo / VNPAY)
- Cung cấp thông tin chi nhánh
PROMPT;
    }

    // ===================================================
    // MAIN CHAT
    // ===================================================

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'user_role' => 'nullable|string',
            'username' => 'nullable|string',
        ]);

        $message  = $request->message;
        $role     = $request->user_role ?? 'USER';
        $username = $request->username ?? 'Khách hàng';

        // ===============================
        // KEYWORD DETECTION
        // ===============================
        $trackingNumber = $this->detectTrackingNumber($message);
        $isServiceQuery = $this->detectServiceQuery($message);
        $isBranchQuery  = $this->detectBranchQuery($message);
        $isPaymentQuery = $this->detectPaymentQuery($message);

        // ===============================
        // QUERY DATABASE
        // ===============================

        $shipment = $trackingNumber
            ? Shipment::with(['customer', 'agent'])->where('tracking_number', $trackingNumber)->first()
            : null;

        $trackingLogs = $shipment
            ? Tracking::with(['fromBranch', 'toBranch', 'status'])
                ->where('shipment_id', $shipment->id)
                ->orderBy('updated_at')
                ->get()
            : collect([]);

        $services = $isServiceQuery
            ? ShipmentService::where('is_active', true)->get()
            : collect([]);

        $branches = $isBranchQuery
            ? Branch::all()
            : collect([]);

        $bill = $shipment
            ? Bill::with('payments')->where('shipment_id', $shipment->id)->first()
            : null;

        // ===============================
        // FORMAT DATA FOR AI
        // ===============================

        $shipmentText = $shipment ? $this->formatShipment($shipment) : "";
        $trackingText = $trackingLogs->isNotEmpty() ? $this->formatTracking($trackingLogs) : "";
        $serviceText  = $services->isNotEmpty() ? $this->formatServices($services) : "";
        $branchText   = $branches->isNotEmpty() ? $this->formatBranches($branches) : "";
        $paymentText  = ($isPaymentQuery && $bill) ? $this->formatBill($bill) : "";

        // ===============================
        // ROLE PROMPT
        // ===============================

        $rolePrompt = $this->rolePrompt($role, $username);

        // ===============================
        // BUILD PROMPT
        // ===============================

        $fullPrompt = $this->systemPrompt .
            "\n\n--- Người dùng ---\n{$rolePrompt}" .
            "\n\n--- Dữ liệu hệ thống ---" .
            ($shipmentText ? "\n\nThông tin đơn hàng:\n{$shipmentText}" : "") .
            ($trackingText ? "\n\nLịch sử vận chuyển:\n{$trackingText}" : "") .
            ($serviceText  ? "\n\nDịch vụ vận chuyển:\n{$serviceText}" : "") .
            ($branchText   ? "\n\nChi nhánh:\n{$branchText}" : "") .
            ($paymentText  ? "\n\nThanh toán:\n{$paymentText}" : "") .
            "\n\n--- Câu hỏi ---\n{$message}\n\nHãy trả lời chính xác dựa trên dữ liệu trên.";

        try {
            $reply = $this->gemini->chat([
                ['role' => 'user', 'content' => $fullPrompt]
            ]);
        } catch (RuntimeException $e) {
            return response()->json(['ok' => false, 'message' => $e->getMessage()], 500);
        }

        return response()->json([
            'ok' => true,
            'assistant' => $reply,
            'shipment' => $shipment,
        ]);
    }

    // ===================================================
    // DETECTION
    // ===================================================

    private function detectTrackingNumber(string $msg): ?string
    {
        preg_match('/[A-Z0-9]{8,}/', strtoupper($msg), $m);
        return $m[0] ?? null;
    }

    private function detectServiceQuery(string $msg): bool
    {
        return str_contains(strtolower($msg), 'dịch vụ');
    }

    private function detectBranchQuery(string $msg): bool
    {
        return str_contains(strtolower($msg), 'chi nhánh')
            || str_contains(strtolower($msg), 'ở đâu');
    }

    private function detectPaymentQuery(string $msg): bool
    {
        return str_contains(strtolower($msg), 'thanh toán')
            || str_contains(strtolower($msg), 'momo')
            || str_contains(strtolower($msg), 'vnpay');
    }

    // ===================================================
    // FORMATTER
    // ===================================================

    private function formatShipment(Shipment $s): string
    {
        return <<<TXT
- Mã vận đơn: {$s->tracking_number}
- Người gửi: {$s->sender_name} ({$s->sender_city})
- Người nhận: {$s->receiver_name} ({$s->receiver_city})
- Khối lượng: {$s->weight} kg
- Phí vận chuyển: {$s->charge} đ
- Ngày dự kiến giao: {$s->expected_delivery_date}
TXT;
    }

    private function formatTracking(Collection $logs): string
    {
        $text = "";
        foreach ($logs as $l) {
            $text .= "- {$l->updated_at}: {$l->status->name} ({$l->note})\n";
        }
        return $text;
    }

    private function formatServices(Collection $services): string
    {
        $text = "";
        foreach ($services as $s) {
            $text .= "- {$s->name} | Giá từ {$s->base_price}đ | {$s->estimated_delivery_time}\n";
        }
        return $text;
    }

    private function formatBranches(Collection $branches): string
    {
        $text = "";
        foreach ($branches as $b) {
            $text .= "- {$b->name}: {$b->address} ({$b->phone})\n";
        }
        return $text;
    }

    private function formatBill(Bill $bill): string
    {
        return <<<TXT
- Tổng tiền: {$bill->total_amount} đ
- Trạng thái: {$bill->status}
- Phương thức: {$bill->payments->pluck('method')->join(', ')}
TXT;
    }

    private function rolePrompt(string $role, string $name): string
    {
        return match ($role) {
            'ADMIN' => "Người dùng là ADMIN – cần thông tin chi tiết, nghiệp vụ.",
            'AGENT' => "Người dùng là NHÂN VIÊN – hỗ trợ xử lý vận đơn.",
            default => "Người dùng là KHÁCH HÀNG – giải thích đơn giản, dễ hiểu.",
        };
    }
}
