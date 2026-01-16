<?php

namespace App\Observers;

use App\Models\Shipment;
use App\Models\Bill;

class ShipmentObserver
{
    /**
     * Handle the Shipment "created" event.
     */
    public function created(Shipment $shipment): void
    {
        if ($shipment->bill()->exists()) {
            return;
        }

        Bill::create([
            'shipment_id'  => $shipment->id,
            'base_amount'  => $shipment->charge,
            'weight_fee'   => 0,
            'tax'          => 0,
            'total_amount' => $shipment->charge,
            'status'       => 'UNPAID',
        ]);
    }
}
