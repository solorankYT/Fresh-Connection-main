<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RandomizeUserCreatedDates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:randomize-dates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Randomize user created_at dates from January to present';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to randomize user creation dates...');

        // Get the start date (January 1st of current year)
        $startDate = Carbon::createFromDate(2024, 11, 1)->startOfDay();
        $endDate = Carbon::now();

        // Get all users
        $users = User::all();
        $total = $users->count();
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($users as $user) {
            // Generate random timestamp between Jan 1 and now
            $randomDate = Carbon::createFromTimestamp(
                rand($startDate->timestamp, $endDate->timestamp)
            );

            // Update the user
            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'created_at' => $randomDate,
                    'updated_at' => $randomDate,
                ]);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Successfully randomized creation dates for ' . $total . ' users!');

        return Command::SUCCESS;
    }
}