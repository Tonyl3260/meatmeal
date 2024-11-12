import React from 'react'; 
import { FaHeart, FaRegHeart } from 'react-icons/fa'; 
import './favorite.css'

const Favorite = ({ recipeId, isFavorite, onToggle }) => {
    const handleClick = (event) => {
        event.stopPropagation(); // Prevents triggering `handleRecipeClick`
        onToggle(recipeId, !isFavorite); // Toggle the favorite status
    };

    return (
        <div onClick={handleClick} className="favorite-icon">
            {isFavorite ? <FaHeart id= "unfavorited" /> : <FaRegHeart id= "favorited"/>}
        </div>
    );
};

export default Favorite;
