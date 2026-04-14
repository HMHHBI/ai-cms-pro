<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Super Admin Create karein
        $user = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@ai-cms.test',
            'password' => Hash::make('superadmin@ai-cms.test'),
            'role' => 'super_admin',
            'company_id' => null,
            'is_active' => true,
        ]);
    }
}
