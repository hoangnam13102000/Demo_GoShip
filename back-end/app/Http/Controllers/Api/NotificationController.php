<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Lấy danh sách tất cả thông báo
    public function index()
    {
        $notifications = Notification::with('account')->get();
        return response()->json($notifications);
    }

    // Tạo thông báo mới
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'is_read' => 'sometimes|boolean',
        ]);

        $notification = Notification::create($request->all());
        return response()->json($notification, 201);
    }

    // Lấy chi tiết thông báo
    public function show($id)
    {
        $notification = Notification::with('account')->findOrFail($id);
        return response()->json($notification);
    }

    // Cập nhật thông báo
    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $request->validate([
            'account_id' => 'sometimes|required|exists:accounts,id',
            'title' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
            'is_read' => 'sometimes|boolean',
        ]);

        $notification->update($request->all());
        return response()->json($notification);
    }

    // Xóa thông báo
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification deleted successfully']);
    }
}
