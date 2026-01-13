<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Customer;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    // Danh sách tài khoản
    public function index()
    {
        return response()->json(Account::all());
    }

    // Tạo tài khoản + tạo thông tin theo role
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:accounts,email',
            'password' => 'required|min:6',
            'role' => 'required|in:ADMIN,AGENT,USER',
            // branch_id chỉ bắt buộc khi role = AGENT
            'branch_id' => 'required_if:role,AGENT|exists:branches,id',
        ]);

        DB::beginTransaction();

        try {
            // 1. Tạo account
            $account = Account::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'status' => 'ACTIVE',
            ]);

            // 2. Tạo bảng phụ theo role
            if ($account->role === 'USER') {
                Customer::create([
                    'account_id' => $account->id,
                    'full_name' => null,
                    'phone' => null,
                    'address' => null,
                ]);
            }

            if ($account->role === 'AGENT') {
                Agent::create([
                    'account_id' => $account->id,
                    'branch_id' => $request->branch_id,
                    'full_name' => null,
                    'phone' => null,
                    'address' => null,
                    'status' => 'ACTIVE',
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Tạo tài khoản thành công',
                'account' => $account,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Tạo tài khoản thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xem chi tiết
    public function show($id)
    {
        return response()->json(Account::findOrFail($id));
    }

    // Cập nhật role / status
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

        return response()->json([
            'message' => 'Deleted'
        ]);
    }
}
