<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    // Lấy danh sách tất cả đại lý
    public function index()
    {
        $agents = Agent::with('account')->get();
        return response()->json($agents);
    }

    // Tạo đại lý mới
    public function store(Request $request)
    {
        $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'branch_name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'status' => 'nullable|in:ACTIVE,INACTIVE',
        ]);

        $agent = Agent::create($request->all());
        return response()->json($agent, 201);
    }

    // Lấy thông tin đại lý theo ID
    public function show($id)
    {
        $agent = Agent::with('account')->findOrFail($id);
        return response()->json($agent);
    }

    // Cập nhật đại lý
    public function update(Request $request, $id)
    {
        $agent = Agent::findOrFail($id);

        $request->validate([
            'account_id' => 'sometimes|required|exists:accounts,id',
            'branch_name' => 'sometimes|required|string|max:255',
            'contact_number' => 'sometimes|nullable|string|max:20',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $agent->update($request->all());
        return response()->json($agent);
    }

    // Xóa đại lý
    public function destroy($id)
    {
        $agent = Agent::findOrFail($id);
        $agent->delete();
        return response()->json(['message' => 'Agent deleted successfully']);
    }
}
