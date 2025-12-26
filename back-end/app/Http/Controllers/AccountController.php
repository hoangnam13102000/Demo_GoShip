<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    // Danh sách tài khoản
    public function index()
    {
        return response()->json(Account::all());
    }

    // Tạo tài khoản
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:accounts',
            'password' => 'required|min:6',
            'role' => 'required|in:ADMIN,AGENT,USER',
        ]);

        $account = Account::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'ACTIVE',
        ]);

        return response()->json($account, 201);
    }

    // Xem chi tiết
    public function show($id)
    {
        return response()->json(Account::findOrFail($id));
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $account = Account::findOrFail($id);

        $account->update($request->only(['role', 'status']));

        return response()->json($account);
    }

    // Xóa
    public function destroy($id)
    {
        Account::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
