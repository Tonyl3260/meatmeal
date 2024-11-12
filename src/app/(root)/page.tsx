'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';
import Favorite from '../../components/favorite/favorite';

const Home = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    const fetchRecipes = async (event) => {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        try {
            const res = await fetch(`http://localhost:4000/recipes?ingredients=${encodeURIComponent(ingredients)}`);
            const data = await res.json();

            if (data && data.length) {
                const ingredientsArray = ingredients.split(',').map(ing => ing.trim().toLowerCase()); // Convert your ingredients into an array and trim whitespace

                // Filter recipes to only include those that contain all the specified ingredients
                const filteredRecipes = data.filter(recipe => {
                    // Extract used and missed ingredients names from the recipe
                    const recipeIngredients = [
                        ...recipe.usedIngredients.map(ing => ing.name.toLowerCase()),
                        ...recipe.missedIngredients.map(ing => ing.name.toLowerCase())
                    ];

                    // Check if all the specified ingredients are present in the recipe
                    return ingredientsArray.every(ingredient =>
                        recipeIngredients.includes(ingredient)
                    );
                });

                if (filteredRecipes.length > 0) {
                    setRecipes(filteredRecipes); // Display the filtered recipes with all specified ingredients
                    setError('');  // Clear any previous errors
                } else {
                    setError('No recipes found with the specified ingredients.');
                    setRecipes([]);  // Clear previous recipes
                }
            } else {
                setError('No recipes found.');
                setRecipes([]);  // Clear previous recipes
            }
        } catch (error) {
            console.error('Error fetching from backend:', error);
            setError('Failed to fetch recipes');
            setRecipes([]); // Clear previous recipes
        }
    };

    // Handle recipe click and navigate to the recipe page
    const handleRecipeClick = (id) => {
        router.push(`/recipes/${id}`)
    };

    const toggleFavorite = async (recipeId, isFavorite) => {
        try {
            await fetch(`http://localhost:4000/favorites/${recipeId}`, {
                method: isFavorite ? 'POST' : 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            setRecipes((prev) =>
                prev.map((r) =>
                    r.id === recipeId ? { ...r, isFavorite } : r
                )
            );
        } catch (error) {
            console.error('Error updating favorite:', error);
        }
    };

    return (
        <div className="homepage">
            <h1>meatmeal</h1>
            <form id="ingredient-form" onSubmit={fetchRecipes} style={{ textAlign: 'center' }}>
                <input
                    type="text"
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients (comma separated)"
                    style={{ display: 'block', margin: '0 auto' }}
                />
                <button type="submit">Search</button>
            </form>
            {<p>{error}</p>}
            {recipes.length > 0 ? (
                <div id="recipe-results">
                    {recipes.map(recipe => (
                        <div
                            key={recipe.id}
                            className="recipe"
                            onClick={() => handleRecipeClick(recipe.id)}
                        >
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="recipe-image"
                            />
                            <div className="recipe-details">
                                <h3>{recipe.title}</h3>
                                <p>Ingredients listed: {recipe.usedIngredients.map(ing => ing.name).join(', ')}</p>
                                <p>Ingredients still needed: {recipe.missedIngredients.map(ing => ing.name).join(', ')}</p>
                            </div>
                            <Favorite
                                recipeId={recipe.id}
                                isFavorite={recipe.isFavorite}
                                onToggle={toggleFavorite}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                error && <p>Please try with different ingredients</p>
            )}
        </div>
    );
};

export default Home;
