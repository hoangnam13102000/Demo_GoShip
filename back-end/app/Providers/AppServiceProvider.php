<?php

namespace App\Providers;
use App\Models\Tracking;
use App\Observers\TrackingObserver;

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
        Tracking::observe(TrackingObserver::class);
    }
}
