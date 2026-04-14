<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\PublicTicketController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// ==========================================
// 1. PUBLIC ROUTES (No Auth Required)
// ==========================================
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Public Support Page (Login ke baghair)
Route::get('/support/{slug}', [PublicTicketController::class, 'show'])->name('public.support');
Route::post('/support/{slug}', [PublicTicketController::class, 'store'])->middleware('throttle:5,1')->name('public.support.store');

// ==========================================
// 2. PROTECTED ROUTES (Auth Required)
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {

    // Smart Dashboard Redirect
    Route::get('/dashboard', function (Request $request) {
        if (Auth::user()->role === 'super_admin') {
            return redirect()->route('super-admin.dashboard');
        }
        return app(TicketController::class)->index($request);
    })->name('dashboard');

    // Profile Management (Inertia)
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    // --- Ticket Operations (Admin & Staff) ---
    Route::middleware(['auth', 'role:admin,staff'])->group(function () {
        Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
        Route::post('/tickets/{ticket}/assign', [TicketController::class, 'assign'])->name('tickets.assign');
        Route::post('/tickets/{ticket}/claim', [TicketController::class, 'claim'])->name('tickets.claim');
        Route::post('/tickets/{ticket}/resolve', [TicketController::class, 'resolve'])->name('tickets.resolve');

        // 🛡️ Rate Limiting: 1 minute mein sirf 3 dafa AI insight/ask chal sakega
        Route::middleware('throttle:3,1')->group(function () {
            Route::post('/ai/insight', [TicketController::class, 'generateInsight'])->name('ai.insight');
            Route::post('/ai/ask', [TicketController::class, 'askAi'])->name('ai.ask');
        });
    });

    // 4. Admin ONLY (Staff Management)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/staff', [StaffController::class, 'index'])->name('staff.index');
        Route::post('/staff', [StaffController::class, 'store'])->name('staff.store');
        Route::delete('/staff/{user}', [StaffController::class, 'destroy'])->name('staff.destroy');
    });

    // 5. Super Admin ONLY (Company Approvals)
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/super-admin', [SuperAdminController::class, 'index'])->name('super-admin.dashboard');
        Route::post('/super-admin/approve/{user}', [SuperAdminController::class, 'approve'])->name('super-admin.approve');
    });
});

require __DIR__ . '/auth.php';