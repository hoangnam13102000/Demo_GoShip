<?php
// app/Events/NewShipmentCreated.php
namespace App\Events;

use App\Models\Shipment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewShipmentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $shipment;
    public $notification;

    public function __construct(Shipment $shipment)
    {
        $this->shipment = $shipment;
        $this->notification = [
            'id' => uniqid(),
            'title' => 'Đơn hàng mới',
            'message' => "Đơn hàng #{$shipment->tracking_number} vừa được tạo",
            'type' => 'new_shipment',
            'data' => [
                'shipment_id' => $shipment->id,
                'tracking_number' => $shipment->tracking_number,
                'customer_name' => $shipment->customer->full_name ?? 'Khách hàng',
                'amount' => $shipment->charge,
                'created_at' => $shipment->created_at->format('H:i d/m/Y'),
            ],
            'timestamp' => now()->timestamp,
        ];
    }

    public function broadcastOn()
    {
        // Chỉ gửi cho admin
        return new PrivateChannel('admin.notifications');
    }

    public function broadcastAs()
    {
        return 'new.shipment';
    }
}