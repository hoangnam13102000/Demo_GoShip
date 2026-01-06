<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Account extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
    ];
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }
    public function agent()
    {
        return $this->hasOne(Agent::class);
    }
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
