'use client';
import React, { useState } from 'react';
import './styles.css';

const Home = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');

    const fetchRecipes = async (event) => {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        try {
            const res = await fetch(`http://localhost:4000/recipes?ingredients=${encodeURIComponent(ingredients)}`);
            const data = await res.json();
            if (data && data.length) {
                setRecipes(data);
                setError('');  // Clear any previous errors
            } else {
                setError('No recipes found.');
                setRecipes([]);  // Clear previous recipes
            }
        } catch (error) {
            console.error('Error fetching from backend:', error);
            setError('Failed to fetch recipes. Please try again.');
        }
    };

    return (
        <div>
            <h1>Recipe Finder</h1>
            <form id="ingredient-form" onSubmit={fetchRecipes}>
                <input 
                    type="text" 
                    id="ingredients" 
                    value={ingredients} 
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients"
                />
                <button type="submit">Find Recipes</button>
            </form>
            {error && <p>{error}</p>}
            {recipes.length > 0 && (
                <div id="recipe-results">
                    {recipes.map(recipe => (
                        <div key={recipe.id} className="recipe">
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
