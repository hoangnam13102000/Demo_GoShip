<?php

namespace App\Services;

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MomoService
{
    /**
     * Tạo link thanh toán MoMo
     */
    public function createPayment(Bill $bill): string
    {
        $endpoint    = config('services.momo.endpoint');
        $partnerCode = config('services.momo.partner_code');
        $accessKey   = config('services.momo.access_key');
        $secretKey   = config('services.momo.secret_key');

        if (!$endpoint || !$partnerCode || !$accessKey || !$secretKey) {
            throw new \Exception('MoMo config thiếu thông tin');
        }

        if ($bill->total_amount <= 0) {
            throw new \Exception('Số tiền thanh toán không hợp lệ');
        }

        $orderId   = 'BILL_' . $bill->id . '_' . time();
        $requestId = (string) time();
        $amount    = (string) intval($bill->total_amount);

        // FE URL
        $redirectUrl = config('app.frontend_url') . "/momo-result";

        $ipnUrl =  route('momo.ipn');

        $orderInfo = "Thanh toán bill #{$bill->id}";
        $extraData = '';

        /**
         * RAW HASH CHUẨN MOMO – KHÔNG ĐỔI THỨ TỰ
         */
        $rawHash =
            "accessKey={$accessKey}" .
            "&amount={$amount}" .
            "&extraData={$extraData}" .
            "&ipnUrl={$ipnUrl}" .
            "&orderId={$orderId}" .
            "&orderInfo={$orderInfo}" .
            "&partnerCode={$partnerCode}" .
            "&redirectUrl={$redirectUrl}" .
            "&requestId={$requestId}" .
            "&requestType=captureWallet";

        $signature = hash_hmac('sha256', $rawHash, $secretKey);

        $payload = [
            'partnerCode' => $partnerCode,
            'accessKey'   => $accessKey,
            'requestId'   => $requestId,
            'amount'      => $amount,
            'orderId'     => $orderId,
            'orderInfo'   => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl'      => $ipnUrl,
            'requestType' => 'captureWallet',
            'extraData'   => $extraData,
            'lang'        => 'vi',
            'signature'   => $signature,
        ];

        Log::info('MoMo payload', $payload);

        $responseRaw = $this->sendRequest($endpoint, $payload);

        Log::error('MoMo RAW response', ['raw' => $responseRaw]);

        $response = json_decode($responseRaw, true);

        if (!is_array($response)) {
            throw new \Exception('MoMo response invalid');
        }

        if (!isset($response['payUrl'])) {
            throw new \Exception(
                'MoMo error: ' . ($response['message'] ?? 'Unknown')
            );
        }

        Payment::create([
            'bill_id'        => $bill->id,
            'method'         => 'MOMO',
            'amount'         => $amount,
            'transaction_id' => $orderId,
            'status'         => 'PENDING',
        ]);

        return $response['payUrl'];
    }

    /**
     * FE gọi sau khi MoMo redirect về
     */
    public function confirmFromClient(
        string $orderId,
        ?string $transId,
        int $resultCode
    ): bool {
        if ($resultCode !== 0) {
            return false;
        }

        return DB::transaction(function () use ($orderId, $transId) {

            $payment = Payment::lockForUpdate()
                ->where('transaction_id', $orderId)
                ->where('status', 'PENDING')
                ->first();

            if (!$payment) {
                return false;
            }

            $bill = Bill::lockForUpdate()->find($payment->bill_id);
            if (!$bill) {
                return false;
            }

            if ($bill->status !== 'PAID') {
                $bill->update(['status' => 'PAID']);
            }

            $payment->update([
                'status'         => 'SUCCESS',
                'paid_at'        => now(),
                'transaction_id' => $transId ?? $orderId,
            ]);

            return true;
        });
    }


    /**
     * CURL gửi request MoMo
     */
    private function sendRequest(string $url, array $payload): string
    {
        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_TIMEOUT        => 30,
        ]);

        $result = curl_exec($ch);

        if ($result === false) {
            Log::error('MoMo CURL error: ' . curl_error($ch));
        }

        curl_close($ch);

        return $result ?: '';
    }
}
