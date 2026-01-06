<?php

namespace App\Http\Controllers;

use App\Models\NotificationTemplate;
use Illuminate\Http\Request;

class NotificationTemplateController extends Controller
{
    public function index()
    {
        return NotificationTemplate::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:notification_templates,code',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'nullable|in:ACTIVE,INACTIVE',
        ]);

        return NotificationTemplate::create($validated);
    }

    public function show($id)
    {
        return NotificationTemplate::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $template = NotificationTemplate::findOrFail($id);

        $validated = $request->validate([
            'code' => 'nullable|unique:notification_templates,code,' . $template->id,
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'status' => 'nullable|in:ACTIVE,INACTIVE',
        ]);

        $template->update($validated);

        return $template;
    }

    public function destroy($id)
    {
        $template = NotificationTemplate::findOrFail($id);
        $template->delete();
        return response()->json(['message' => 'Template deleted successfully']);
    }
}
