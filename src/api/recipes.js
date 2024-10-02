const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(cors());

app.get('/recipes', async (req, res) => {
  const ingredients = req.query.ingredients;
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${encodeURIComponent(ingredients)}&number=100`;

  try {
    const response = await axios.get(url);
    const filteredRecipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients,
      missedIngredients: recipe.missedIngredients,
    }));

    res.status(200).json(filteredRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      message: 'Error fetching recipes',
    });
  }
});

// Fetch individual recipe details by ID
app.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  console.log(`Received request for recipe ID: ${recipeId}`);

  const apiKey = process.env.SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);

    // Extract necessary data from the response
    const recipeDetails = {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      ingredients: response.data.extendedIngredients.map(ingredient => ingredient.name),
      instructions: response.data.instructions,
    };

    // Check if the instructions exist and clean up any HTML tags
    if (recipeDetails.instructions) {
      recipeDetails.instructions = recipeDetails.instructions.replace(/<\/?li>|<\/?ol>/g, "");
    }

    console.log(recipeDetails);

    res.status(200).json(recipeDetails);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({
      message: 'Error fetching recipe details',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
