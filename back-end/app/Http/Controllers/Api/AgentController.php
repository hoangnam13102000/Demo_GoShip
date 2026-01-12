<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    /**
     * Lấy danh sách Agent
     */
    public function index()
    {
        $agents = Agent::with('account', 'branch')->get();
        return response()->json($agents);
    }

    /**
     * Tạo Agent mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'branch_id' => 'required|exists:branches,id',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'status' => 'nullable|in:ACTIVE,INACTIVE',
        ]);

        $agent = Agent::create([
            'account_id' => $validated['account_id'],
            'branch_id' => $validated['branch_id'],
            'full_name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => $validated['status'] ?? 'ACTIVE',
        ]);

        return response()->json($agent, 201);
    }

    /**
     * Lấy chi tiết Agent
     */
    public function show($id)
    {
        $agent = Agent::with('account', 'branch')->findOrFail($id);
        return response()->json($agent);
    }

    /**
     * Cập nhật Agent
     */
    public function update(Request $request, $id)
    {
        $agent = Agent::findOrFail($id);

        $validated = $request->validate([
            'account_id' => 'sometimes|required|exists:accounts,id',
            'branch_id' => 'sometimes|required|exists:branches,id',
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:255',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $agent->update($validated);

        return response()->json($agent);
    }

    /**
     * Xoá Agent
     */
    public function destroy($id)
    {
        $agent = Agent::findOrFail($id);
        $agent->delete();

        return response()->json([
            'message' => 'Agent deleted successfully',
        ]);
    }
}
