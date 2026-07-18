<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    /**
     * Forzar la conexión con la tabla en inglés de tu migración.
     */
    protected $table = 'orders';

    /**
     * Atributos asignables de forma masiva (Hacen match exacto con tu migración).
     */
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
    ];

    /**
     * Relación: El estudiante que compra el pedido (Apunta a user_id).
     */
    public function cliente()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación: La sucursal/local de comida (Apunta a branch_id).
     */
    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}