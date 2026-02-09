<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'country',
        'state',
        'city',
        'address_line',
        'postal_code',
        'lat',
        'lng',
    ];

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }
}