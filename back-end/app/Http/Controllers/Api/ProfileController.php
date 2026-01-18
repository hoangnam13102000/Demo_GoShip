<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Agent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function getProfile($accountId)
    {
        try {
            $account = Account::findOrFail($accountId);

            $profile = null;

            if ($account->role === 'USER') {
                $customer = Customer::where('account_id', $account->id)->first();

                if ($customer) {
                    $profile = [
                        'account_id'  => $account->id,
                        'customer_id' => $customer->id,
                        'role' => 'USER',
                        'full_name' => $customer->full_name,
                        'phone' => $customer->phone,
                        'email' => $account->email,
                        'address' => $customer->address,
                    ];
                }
            } elseif ($account->role === 'AGENT') {
                $agent = Agent::where('account_id', $account->id)->first();

                if ($agent) {
                    $profile = [
                        'role' => 'AGENT',
                        'account_id'  => $account->id,
                        'customer_id' => $agent->id,
                        'full_name' => $agent->full_name ?? '',
                        'phone' => $agent->phone ?? '',
                        'email' => $account->email,
                        'address' => $agent->address ?? '',
                    ];
                }
            } else { // ADMIN
                $profile = [
                    'account_id' => $account->id,
                    'role' => 'ADMIN',
                    'email' => $account->email,
                ];
            }

            return response()->json($profile);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Account not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    public function updateProfile(Request $request, $accountId)
    {
        try {
            $account = Account::findOrFail($accountId);

            $request->validate([
                'email' => 'nullable|email|unique:accounts,email,' . $account->id,
                'full_name' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
            ]);

            if ($request->filled('email')) {
                $account->email = $request->email;
                $account->save();
            }

            if ($account->role === 'USER') {
                $customer = Customer::where('account_id', $account->id)->firstOrFail();

                $customer->update([
                    'full_name' => $request->full_name ?? $customer->full_name,
                    'phone'     => $request->phone ?? $customer->phone,
                    'address'   => $request->address ?? $customer->address,
                ]);
            } elseif ($account->role === 'AGENT') {
                $agent = Agent::where('account_id', $account->id)->firstOrFail();

                $agent->update([
                    'full_name' => $request->full_name ?? $agent->full_name,
                    'phone'     => $request->phone ?? $agent->phone,
                    'address'   => $request->address ?? $agent->address,
                ]);
            }

            return response()->json([
                'message' => 'Cập nhật profile thành công'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Account/Profile not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    public function changePassword(Request $request, $accountId)
    {
        try {
            $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|min:6',
                'new_password_confirmation' => 'required|same:new_password',
            ]);

            $account = Account::findOrFail($accountId);

            if (!Hash::check($request->current_password, $account->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mật khẩu hiện tại không đúng'
                ], 422);
            }

            $account->password = Hash::make($request->new_password);
            $account->save();

            $account->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
                'requires_relogin' => true
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->validator->errors()->first()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản không tồn tại'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống. Vui lòng thử lại sau.'
            ], 500);
        }
    }
}
