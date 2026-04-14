<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
  public function index()
  {
    // Sirf Super Admin hi ye dekh sakay
    if (Auth::user()->role !== 'super_admin') {
      abort(403);
    }

    return Inertia::render('SuperAdmin/Dashboard', [
      'companies' => Company::withCount('users')->get(),
      'pendingUsers' => User::where('role', 'admin')
        ->where('is_active', false)
        ->with('company')
        ->get()
    ]);
  }

  public function approve(User $user)
  {
    if (Auth::user()->role !== 'super_admin') {
      abort(403);
    }

    $user->update(['is_active' => true]);

    return redirect()->back()->with('status', "Account for {$user->name} activated successfully!");
  }
}
