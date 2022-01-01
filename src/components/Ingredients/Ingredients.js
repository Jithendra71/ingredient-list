import React, { useState } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import { useCallback } from 'react/cjs/react.development';

function Ingredients() {
  const [ingredients, setIngredients] = useState([])

  const onSearch= useCallback(searchedIngredients=>{
    setIngredients(searchedIngredients)
  },[])

  

  const addIngredientHandler = ingredient =>{
    fetch('https://ingredients-list-71-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{ 'Content-Type':'application/json' }
    }).then(response=>response.json())
    .then(data=>{
      setIngredients(prevIngredients => [
        ...prevIngredients,
        {...ingredient, id:data.name}
      ])
    })

    
  }

  const removeIngredientHandler =ingridientId=>{
    setIngredients(prevIngredients=> 
      prevIngredients.filter(ingredient=>ingredient.id!==ingridientId))
  }

  return (
    <div className="App">
      <IngredientForm addIngredientHandler={addIngredientHandler}/>

      <section>
        <Search  onSearch={onSearch}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
