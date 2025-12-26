<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
class AuthController extends Controller
{
    // ================= LOGIN  =================
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

        if (strtolower($account->status) !== 'active') {
            return response()->json([
                'message' => 'Tài khoản bị khóa'
            ], 403);
        }

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'user' => [
                'id'     => $account->id,
                'email'  => $account->email,
                'role'   => $account->role,
                'status' => $account->status,
            ]
        ]);
    }

    // ================= REGISTER  =================
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

        Auth::login($account);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => [
                'id'    => $account->id,
                'email' => $account->email,
                'role'  => $account->role,
            ]
        ], 201);
    }

    // ================= LOGOUT =================
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Đã đăng xuất'
        ]);
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

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Yêu cầu đặt lại mật khẩu không tồn tại.'
            ], 400);
        }

        // Check token
        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.'
            ], 400);
        }

        // Update password (Model tự hash)
        $account = Account::where('email', $request->email)->first();
        $account->password = $request->password;
        $account->save();

        // Xoá token sau khi dùng
        DB::table('password_resets')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đặt lại mật khẩu thành công.'
        ]);
    }

}
