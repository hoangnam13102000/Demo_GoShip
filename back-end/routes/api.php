<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\ShipmentController;
use App\Http\Controllers\Api\ShipmentStatusHistoryController;

use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\NotificationTemplateController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::apiResource('accounts', AccountController::class);
Route::apiResource('customers', CustomerController::class);
Route::apiResource('agents', AgentController::class);
Route::apiResource('shipments', ShipmentController::class);
Route::apiResource('shipment-status-histories', ShipmentStatusHistoryController::class);
Route::apiResource('notifications', NotificationController::class);
Route::apiResource('reports', ReportController::class);
Route::apiResource('branches', BranchController::class);
Route::apiResource('bills', BillController::class);
Route::apiResource('notification-templates', NotificationTemplateController::class);
Route::get('/ping', function () {
    return response()->json(['message' => 'API is working']);
});