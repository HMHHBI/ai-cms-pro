<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
  public function handle(Request $request, Closure $next, ...$roles): Response
  {
    // Agar user login nahi hai ya uska role allowed roles mein nahi hai
    if (!Auth::check() || !in_array($request->user()->role, $roles)) {
      abort(403, 'Aapko is page ki ijazat nahi hai.');
    }

    return $next($request);
  }
}