<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'pedido_id',
        'user_id',
        'rateable_id',
        'rateable_type',
        'stars',
        'comment',
    ];

    /**
     * El pedido al que pertenece esta calificación.
     * Columna real en la tabla: pedido_id.
     */
    public function order()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rateable()
    {
        return $this->morphTo();
    }
}
