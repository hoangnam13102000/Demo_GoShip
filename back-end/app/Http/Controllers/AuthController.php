<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $account = Account::where('email', $request->email)->first();

        if (!$account || !Hash::check($request->password, $account->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        if (strtoupper($account->status) !== 'ACTIVE') {
            return response()->json([
                'message' => 'Tài khoản bị khóa'
            ], 403);
        }

        // Xoá token cũ
        $account->tokens()->delete();

        // Tạo token mới
        $token = $account->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'user' => [
                'id'     => $account->id,
                'email'  => $account->email,
                'role'   => strtoupper($account->role),
                'status' => strtoupper($account->status),
            ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id'     => $user->id,
            'email'  => $user->email,
            'role'   => strtoupper($user->role),
            'status' => strtoupper($user->status),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đã đăng xuất'
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|unique:accounts,email',
            'password' => 'required|min:6|confirmed',
        ]);

        DB::beginTransaction();

        try {
            // 1. Tạo account
            $account = Account::create([
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'USER',
                'status'   => 'ACTIVE',
            ]);

            // 2. Tạo customer tương ứng (KHÔNG NULL)
            Customer::create([
                'account_id' => $account->id,
                'full_name'  => '',
                'phone'      => '',
                'address'    => '',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Đăng ký thành công',
                'user' => [
                    'id'    => $account->id,
                    'email' => $account->email,
                    'role'  => $account->role,
                ]
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Đăng ký thất bại',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
