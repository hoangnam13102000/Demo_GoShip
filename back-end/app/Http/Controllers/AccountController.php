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
    /**
     * =========================
     * Danh sách tài khoản
     * =========================
     * -> Load kèm agent để FE edit branch_id
     */
    public function index()
    {
        return response()->json(
            Account::with('agent')->get()
        );
    }

    /**
     * =========================
     * Tạo tài khoản
     * =========================
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'     => 'required|email|unique:accounts,email',
            'password'  => 'required|min:6',
            'role'      => 'required|in:ADMIN,AGENT,USER',
            'branch_id' => 'required_if:role,AGENT|exists:branches,id',
        ]);

        DB::beginTransaction();

        try {
            // 1. Tạo account
            $account = Account::create([
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->role,
                'status'   => 'ACTIVE',
            ]);

            // 2. Tạo bảng phụ theo role
            if ($account->role === 'USER') {
                Customer::create([
                    'account_id' => $account->id,
                    'full_name'  => null,
                    'phone'      => null,
                    'address'    => null,
                ]);
            }

            if ($account->role === 'AGENT') {
                Agent::create([
                    'account_id' => $account->id,
                    'branch_id'  => $request->branch_id,
                    'full_name'  => null,
                    'phone'      => null,
                    'address'    => null,
                    'status'     => 'ACTIVE',
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
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =========================
     * Xem chi tiết
     * =========================
     */
    public function show($id)
    {
        return response()->json(
            Account::with('agent')->findOrFail($id)
        );
    }

    /**
     * =========================
     * Cập nhật tài khoản
     * =========================
     * -> Giữ logic cũ
     * -> Bổ sung:
     *    - đổi password (nếu có)
     *    - update branch cho AGENT
     */
    public function update(Request $request, $id)
    {
        $account = Account::findOrFail($id);

        $request->validate([
            'role'      => 'required|in:ADMIN,AGENT,USER',
            'status'    => 'required|in:ACTIVE,INACTIVE',
            'password'  => 'nullable|min:6',
            'branch_id' => 'required_if:role,AGENT|exists:branches,id',
        ]);

        DB::beginTransaction();

        try {
            // 1. Update account
            $account->role   = $request->role;
            $account->status = $request->status;

            if ($request->filled('password')) {
                $account->password = Hash::make($request->password);
            }

            $account->save();

            // 2. Update bảng phụ theo role
            if ($account->role === 'AGENT') {
                Agent::updateOrCreate(
                    ['account_id' => $account->id],
                    [
                        'branch_id' => $request->branch_id,
                        'status'    => $request->status,
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật tài khoản thành công',
                'account' => $account,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Cập nhật tài khoản thất bại',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * =========================
     * Xóa tài khoản
     * =========================
     */
    public function destroy($id)
    {
        Account::destroy($id);

        return response()->json([
            'message' => 'Deleted',
        ]);
    }
}
