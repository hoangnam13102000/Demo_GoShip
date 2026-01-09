<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    // Lấy danh sách tất cả khách hàng
    public function index()
    {
        $customers = Customer::with('account:id,email')->get();
        return response()->json($customers);
    }

    // Tạo khách hàng mới
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:accounts,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $account = Account::create([
                'email' => $request->email,
                'password' => bcrypt('123456'),
                'role' => 'USER',
                'status' => 'ACTIVE',
            ]);

            $customer = Customer::create([
                'account_id' => $account->id,
                'full_name' => $request->full_name,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            DB::commit();

            return response()->json(
                $customer->load('account:id,email'),
                201
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Không thể tạo khách hàng'
            ], 500);
        }
    }

    // Lấy chi tiết khách hàng
    public function show($id)
    {
        $customer = Customer::with('account:id,email')
            ->findOrFail($id);

        return response()->json($customer);
    }

    // Cập nhật khách hàng
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $request->validate([
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:255',
        ]);

        $customer->update([
            'full_name' => $request->full_name ?? $customer->full_name,
            'phone' => $request->phone ?? $customer->phone,
            'address' => $request->address ?? $customer->address,
        ]);

        return response()->json(
            $customer->load('account:id,email')
        );
    }

    // Xóa khách hàng
    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully'
        ]);
    }
}
