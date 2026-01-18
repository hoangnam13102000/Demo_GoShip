<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Notification::with(['shipment', 'shipment.customer'])
            ->where('account_id', $user->id)
            ->orderBy('sent_at', 'desc');

        if ($request->has('unread_only') && $request->unread_only) {
            $query->where('is_read', false);
        }

        $notifications = $query->paginate(20);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => Notification::where('account_id', $user->id)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    public function markAsRead($id)
    {
        $user = Auth::user();
        
        $notification = Notification::where('id', $id)
            ->where('account_id', $user->id)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'unread_count' => Notification::where('account_id', $user->id)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();
        
        Notification::where('account_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'unread_count' => 0,
        ]);
    }

    public function getUnreadCount()
    {
        $user = Auth::user();
        
        $count = Notification::where('account_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}