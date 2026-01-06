<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    // Lấy danh sách tất cả chi nhánh
    public function index()
    {
        $branches = Branch::with('agents')->get();
        return response()->json($branches);
    }

    // Tạo chi nhánh mới
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'nullable|in:ACTIVE,INACTIVE',
        ]);

        $branch = Branch::create($request->all());
        return response()->json($branch, 201);
    }

    // Lấy chi tiết chi nhánh
    public function show($id)
    {
        $branch = Branch::with('agents')->findOrFail($id);
        return response()->json($branch);
    }

    // Cập nhật chi nhánh
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|nullable|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'status' => 'sometimes|in:ACTIVE,INACTIVE',
        ]);

        $branch->update($request->all());
        return response()->json($branch);
    }

    // Xóa chi nhánh
    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();
        return response()->json(['message' => 'Branch deleted successfully']);
    }
}
