<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use Carbon\Carbon;

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
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không đúng'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        // (Khuyên dùng) logout tất cả thiết bị
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }
    // ================= FORGOT PASSWORD =================
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:accounts,email'
        ]);

        try {
            $account = Account::where('email', $request->email)->first();

            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email không tồn tại trong hệ thống'
                ], 404);
            }

            // Tạo reset token
            $token = Str::random(64);

            // SỬA: Dùng bảng password_reset_tokens
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => Hash::make($token),
                    'created_at' => Carbon::now()
                ]
            );

            // Tạo reset link
            $resetLink = config('app.frontend_url', 'http://localhost:5178') . "/dat-lai-mat-khau?token=" . urlencode($token) . "&email=" . urlencode($request->email);

            // Gửi email reset password
            Mail::to($request->email)->send(new ResetPasswordMail($resetLink));

            Log::info('Password reset link sent', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Link đặt lại mật khẩu đã được gửi đến email của bạn'
            ]);
        } catch (\Exception $e) {
            Log::error('Forgot password error: ' . $e->getMessage(), [
                'email' => $request->email,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.'
            ], 500);
        }
    }

    // ================= RESET PASSWORD =================
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:accounts,email',
            'password' => 'required|min:6|confirmed'
        ], [
            'email.exists' => 'Email không tồn tại trong hệ thống',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp'
        ]);

        try {
            // Tìm token reset - SỬA: Dùng bảng password_reset_tokens
            $resetRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$resetRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token đặt lại mật khẩu không hợp lệ'
                ], 400);
            }

            // Kiểm tra token
            if (!Hash::check($request->token, $resetRecord->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token đặt lại mật khẩu không hợp lệ'
                ], 400);
            }

            // Kiểm tra token hết hạn (24 giờ)
            $tokenAge = Carbon::parse($resetRecord->created_at)->diffInHours(Carbon::now());
            if ($tokenAge > 24) {
                // Xóa token hết hạn
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();

                return response()->json([
                    'success' => false,
                    'message' => 'Token đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.'
                ], 400);
            }

            // Tìm và cập nhật mật khẩu account
            $account = Account::where('email', $request->email)->first();
            if (!$account) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản không tồn tại'
                ], 404);
            }

            // Cập nhật mật khẩu mới
            $account->password = Hash::make($request->password);
            $account->save();

            // Xóa tất cả token của user
            $account->tokens()->delete();

            // Xóa token reset đã sử dụng - SỬA: Dùng bảng password_reset_tokens
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            Log::info('Password reset successful', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.'
            ]);
        } catch (\Exception $e) {
            Log::error('Reset password error: ' . $e->getMessage(), [
                'email' => $request->email,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.'
            ], 500);
        }
    }

    // ================= VALIDATE RESET TOKEN =================
    public function validateResetToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email'
        ]);

        try {
            // SỬA: Dùng bảng password_reset_tokens
            $resetRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$resetRecord) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Token không tồn tại'
                ], 404);
            }

            // Kiểm tra token
            if (!Hash::check($request->token, $resetRecord->token)) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Token không hợp lệ'
                ], 400);
            }

            // Kiểm tra token hết hạn (24 giờ)
            $tokenAge = Carbon::parse($resetRecord->created_at)->diffInHours(Carbon::now());
            if ($tokenAge > 24) {
                // Xóa token hết hạn
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();

                return response()->json([
                    'valid' => false,
                    'message' => 'Token đã hết hạn'
                ], 400);
            }

            return response()->json([
                'valid' => true,
                'message' => 'Token hợp lệ'
            ]);
        } catch (\Exception $e) {
            Log::error('Validate token error: ' . $e->getMessage());

            return response()->json([
                'valid' => false,
                'message' => 'Không thể xác thực token'
            ], 500);
        }
    }
}
