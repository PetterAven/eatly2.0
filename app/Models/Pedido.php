<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'branch_id',
        'cart_id',
        'code',
        'status',
        'mode',
        'scheduled_at',
        'payment_status',
        'subtotal',
        'discount',
        'total',
        'driver_id',
        'destino_edificio',
        'destino_aula',
        'delivery_lat',
        'delivery_lng',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'delivery_lat' => 'decimal:7',
        'delivery_lng' => 'decimal:7',
    ];

    public function cliente()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    /**
     * La tabla ratings real usa "pedido_id" como llave foránea (no "order_id").
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'pedido_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
