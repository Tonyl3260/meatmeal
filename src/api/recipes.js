const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(cors());

// Fetch recipes from Spoonacular API
app.get('/recipes', async (req, res) => {
  const ingredients = req.query.ingredients;

  const apiKey = process.env.SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${encodeURIComponent(ingredients)}`;

  try {
    const response = await axios.get(url);
    
    // Filter the data and include the image in the response
    const filteredRecipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,  
      usedIngredients: recipe.usedIngredients,
      missedIngredients: recipe.missedIngredients,
    }));

    console.log('Sending back filtered recipes');
    console.log(filteredRecipes);
    res.status(200).json(filteredRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
