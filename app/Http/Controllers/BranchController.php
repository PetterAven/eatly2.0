<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource for the student menu.
     */
    public function show(Branch $branch)
    {
        // Carga las relaciones del local seleccionado
        $branch->load(['restaurant', 'location', 'images', 'image']);

        // Obtiene únicamente los platillos asociados a este local o restaurante
        $items = Item::where('branch_id', $branch->id)
            ->orWhere('restaurant_id', $branch->restaurant_id)
            ->latest()
            ->get();

        return Inertia::render('Student/BranchMenu', [
            'branch' => $branch,
            'items'  => $items,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Branch $branch)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch)
    {
        //
    }
}