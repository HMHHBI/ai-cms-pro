<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Ticket extends Model
{
    protected $fillable = [
        'company_id',
        'user_id',
        'subject',
        'customer_name',
        'customer_email',
        'message',
        'status',
        'priority',
        'ai_suggestion',
        'ai_sentiment',
        'assigned_to',
    ];

    // In attributes ko har waqt JSON mein shamil karne ke liye
    protected $appends = ['created_at_human', 'is_overdue', 'priority_color', 'mood'];
    

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    protected static function booted()
    {
        static::addGlobalScope('company', function ($builder) {
            // Agar user super_admin nahi hai, toh hamesha uski company ke tickets dikhao
            if (Auth::check() && Auth::user()->role !== 'super_admin') {
                $builder->where('tickets.company_id', Auth::user()->company_id);
            }
        });
    }

    public function getPriorityColorAttribute()
    {
        return match ($this->priority) {
            'high' => 'bg-red-100 text-red-700 border-red-200',
            'medium' => 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'low' => 'bg-blue-100 text-blue-700 border-blue-200',
            default => 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }

    public function getMoodAttribute()
    {
        return strtolower($this->ai_sentiment ?? 'unknown');
    }
    
    // 1. "2 hours ago" format ke liye
    public function getCreatedAtHumanAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    // 2. Overdue check (24 ghante wala logic)
    public function getIsOverdueAttribute()
    {
        return $this->status === 'open' && $this->created_at->diffInHours(now()) > 24;
    }
}
