<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        if (env('APP_ENV') === 'production') {
        URL::forceScheme('https');
    }
        foreach ([
            storage_path('framework/views'),
            storage_path('framework/cache'),
            storage_path('framework/sessions'),
        ] as $path) {
            if (!is_dir($path)) {
                mkdir($path, 0775, true);
            }
        }
    }
}
