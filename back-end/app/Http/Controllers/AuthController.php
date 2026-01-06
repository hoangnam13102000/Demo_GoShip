<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\ResetPasswordMail;

class AuthController extends Controller
{
    // ================= LOGIN =================
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

        // ✅ XÓA TOKEN CŨ (TRÁNH TRÙNG)
        $account->tokens()->delete();

        // ✅ TOKEN SANCTUM (CHUẨN)
        $token = $account->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'token'   => $token,
            'user' => [
                'id'     => $account->id,
                'email'  => $account->email,
                'role'   => strtoupper($account->role),
                'status' => strtoupper($account->status),
            ]
        ]);
    }

    // ================= GET CURRENT USER =================
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

    // ================= LOGOUT =================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đã đăng xuất'
        ]);
    }

    // ================= REGISTER =================
    public function register(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|unique:accounts,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $account = Account::create([
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'USER',
            'status'   => 'ACTIVE',
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => [
                'id'    => $account->id,
                'email' => $account->email,
                'role'  => $account->role,
            ]
        ], 201);
    }

    // ================= FORGOT PASSWORD =================
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:accounts,email'
        ]);

        $token = Str::random(64);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        $link = config('app.frontend_url')
            . '/reset-mat-khau?token=' . $token
            . '&email=' . urlencode($request->email);

        Mail::to($request->email)->send(new ResetPasswordMail($link));

        return response()->json([
            'success' => true,
            'message' => 'Email đặt lại mật khẩu đã được gửi.'
        ]);
    }

    // ================= RESET PASSWORD =================
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:accounts,email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.'
            ], 400);
        }

        $account = Account::where('email', $request->email)->first();
        $account->password = Hash::make($request->password);
        $account->save();

        DB::table('password_resets')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đặt lại mật khẩu thành công.'
        ]);
    }
}
