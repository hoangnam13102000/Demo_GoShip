<?php
namespace App\Services;

use App\Models\Notification;
use App\Models\Account;
use App\Models\Shipment;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public static function createNewShipmentNotification(Shipment $shipment)
    {
        DB::transaction(function () use ($shipment) {
            // Lấy tất cả admin accounts
            $adminAccounts = Account::where('role', 'ADMIN')
                ->where('status', 'ACTIVE')
                ->get();

            foreach ($adminAccounts as $admin) {
                Notification::create([
                    'account_id' => $admin->id,
                    'shipment_id' => $shipment->id,
                    'title' => 'Đơn hàng mới',
                    'message' => "Đơn hàng #{$shipment->tracking_number} vừa được tạo bởi " . 
                               ($shipment->customer->full_name ?? 'khách hàng'),
                    'is_read' => false,
                    'sent_at' => now(),
                ]);
            }

            // Dispatch event for real-time notification
            event(new \App\Events\NewShipmentCreated($shipment));
        });
    }

    public static function markAsRead($notificationId, $accountId)
    {
        Notification::where('id', $notificationId)
            ->where('account_id', $accountId)
            ->update(['is_read' => true]);
    }

    public static function markAllAsRead($accountId)
    {
        Notification::where('account_id', $accountId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    public static function getUnreadCount($accountId)
    {
        return Notification::where('account_id', $accountId)
            ->where('is_read', false)
            ->count();
    }
}