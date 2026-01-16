<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\Api\ShipmentServiceController;
use App\Http\Controllers\Api\ShipmentStatusController; 
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\BillController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ShipmentTransferController;
use App\Http\Controllers\Api\MomoController;




Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:ADMIN')->get('/admin/dashboard', function() {
        return ['message' => 'Admin dashboard'];
    });

    Route::middleware('role:AGENT')->get('/agent/dashboard', function() {
        return ['message' => 'Agent dashboard'];
    });

    Route::middleware('role:USER')->get('/dashboard', function() {
        return ['message' => 'User dashboard'];

    });

    
});

Route::get('/dashboard/revenue', [DashboardController::class, 'revenueLast12Months']);
Route::get('/dashboard/top-customers', [DashboardController::class, 'topCustomers']);
Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
Route::get('/dashboard/top-services', [DashboardController::class, 'topServices']);
Route::get('/dashboard/export', [DashboardController::class, 'exportExcel']);
Route::get('/dashboard/export-receipts', [DashboardController::class, 'exportReceiptsExcel']);

Route::apiResource('accounts', AccountController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('agents', AgentController::class);
Route::apiResource('shipments', ShipmentController::class);
Route::get('shipments/track/{tracking_number}', [ShipmentController::class, 'track']);
Route::get('shipments/my-orders', [ShipmentController::class, 'myOrders']);
Route::apiResource('notifications', NotificationController::class);
Route::apiResource('reports', ReportController::class);
Route::apiResource('branches', BranchController::class);
Route::apiResource('bills', BillController::class);
Route::apiResource('shipment-statuses', ShipmentStatusController::class);
Route::apiResource('tracking', TrackingController::class);
Route::apiResource('shipment-services', ShipmentServiceController::class);
Route::get('/ping', function () {
    return response()->json(['message' => 'API is working']);
});
Route::get('/profile/{accountId}', [ProfileController::class, 'getProfile']);
Route::post(
    '/shipments/transfer',
    [ShipmentTransferController::class, 'transfer']
);


Route::prefix('momo')->group(function () {
    Route::post('/create',  [MomoController::class, 'create']);
    Route::get('/return',   [MomoController::class, 'return'])->name('momo.return');
    Route::post('/confirm', [MomoController::class, 'confirm']);
    Route::post('/ipn',     [MomoController::class, 'ipn'])->name('momo.ipn');
});
