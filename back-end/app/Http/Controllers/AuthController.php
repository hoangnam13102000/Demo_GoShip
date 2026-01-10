<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            return response()->json(['message' => 'Email hoặc mật khẩu không đúng'], 401);
        }

        if (strtoupper($account->status) !== 'ACTIVE') {
            return response()->json(['message' => 'Tài khoản bị khóa'], 403);
        }

        $account->tokens()->delete();

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

        return response()->json(['message' => 'Đã đăng xuất']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:accounts,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $account = Account::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'USER',
            'status' => 'ACTIVE',
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => [
                'id' => $account->id,
                'email' => $account->email,
                'role' => $account->role,
            ]
        ], 201);
    }
}
