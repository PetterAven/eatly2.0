<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'description',
        'phone',
        'email',
        'address',
        'latitude',
        'longitude',
        'schedule',
        'image',
    ];

    protected $casts = [
        'schedule' => 'array',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function branches()
    {
        return $this->hasMany(Branch::class);
    }

    // imágenes del restaurante (logo, portada, etc.)
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
