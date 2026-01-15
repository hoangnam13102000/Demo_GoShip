<?php

namespace App\Services;

use App\Models\Branch;
class BranchResolver
{
    public static function resolveByCity(string $city): ?Branch
    {
        return Branch::where('city', $city)
            ->where('status', 'ACTIVE')
            ->first();
    }

    public static function resolveHub(): ?Branch
    {
        return Branch::where('city', 'HUB')
            ->where('status', 'ACTIVE')
            ->first();
    }
}
