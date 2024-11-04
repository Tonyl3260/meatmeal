'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './recipes.css';

const RecipePage = ({ params }: { params: { id: string } }) => {
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (params.id) {
            fetch(`http://localhost:4000/recipes/${params.id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    setRecipe(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                    setError('Recipe not found.');
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!recipe) {
        return <p>Recipe not found.</p>;
    }

    return (
        <div className="recipe-container">
            <div className="recipe-header">
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-title-container">
                    <h1 className="recipe-title">{recipe.title}</h1>
                    <div className="recipe-meta">
                        <span>Servings: {recipe.servings}</span>
                        <span>Prep Time: {recipe.prepTime}</span>
                    </div>
                </div>
            </div>
            <div className="recipe-content">
                <div className="recipe-ingredients">
                    <h2>Ingredients</h2>
                    <ul className="ingredients-list">
                        {recipe.ingredients.map((ingredient: string, index: number) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div className="recipe-instructions">
                    <h2>Directions</h2>
                    <ol className="directions-list">
                        {recipe.steps.map((step: any, index: number) => (
                            <li key={index}>{step.step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default RecipePage;
