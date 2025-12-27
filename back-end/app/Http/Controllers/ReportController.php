<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // Lấy danh sách tất cả báo cáo
    public function index()
    {
        $reports = Report::all();
        return response()->json($reports);
    }

    // Tạo báo cáo mới
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'report_type' => 'required|in:SHIPMENTS_BY_DATE,SHIPMENTS_BY_CITY,AGENT_PERFORMANCE',
            'data' => 'nullable|array',
        ]);

        $report = Report::create($request->all());
        return response()->json($report, 201);
    }

    // Lấy chi tiết báo cáo
    public function show($id)
    {
        $report = Report::findOrFail($id);
        return response()->json($report);
    }

    // Cập nhật báo cáo
    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'report_type' => 'sometimes|required|in:SHIPMENTS_BY_DATE,SHIPMENTS_BY_CITY,AGENT_PERFORMANCE',
            'data' => 'sometimes|nullable|array',
        ]);

        $report->update($request->all());
        return response()->json($report);
    }

    // Xóa báo cáo
    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['message' => 'Report deleted successfully']);
    }
}
