<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // <-- import Log

class ProfileController extends Controller
{
    public function getProfile($accountId)
    {
        try {
            Log::info("Profile request for account_id: {$accountId}");

            $account = Account::findOrFail($accountId);
            Log::info("Account found", ['account_id' => $account->id, 'role' => $account->role]);

            $profile = null;

            if ($account->role === 'USER') {
                $customer = Customer::where('account_id', $account->id)->first();
                Log::info("Customer fetched", ['customer' => $customer]);

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
                Log::info("Agent fetched", ['agent' => $agent]);

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

            Log::info("Returning profile", ['profile' => $profile]);

            return response()->json($profile);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning("Account not found: {$accountId}");
            return response()->json(['error' => 'Account not found'], 404);
        } catch (\Exception $e) {
            Log::error("Error fetching profile: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}
