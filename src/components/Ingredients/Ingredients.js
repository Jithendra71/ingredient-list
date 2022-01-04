import React, { useMemo } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import { useCallback, useReducer } from 'react/cjs/react.development';
import ErrorModal from '../UI/ErrorModal' 

const ingredientReducer = (currentIngredients, action) =>{
  switch(action.type){
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients,action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Something is not right with Reducer')
  }
}

const httpReducer = (state, action)=>{
  switch(action.type){
    case 'SENT':
      return {loading:true, error:null} 
    case 'RESPOND':
      return { ...state,loading:false}
    case 'ERROR':
      return {loading:false,error:action.errorMessage}
    case 'CLEAR':
      return {...state,error:null}
    default:
      console.log(action)
      throw new Error('Something is not right with Reducer')
  }
}

const Ingredients = ()=> {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState,httpDispatch]=useReducer(httpReducer,{loading:false,error:null})

  const onSearch= useCallback(searchedIngredients=>{
    dispatch({
      type:'SET',
      ingredients:searchedIngredients
    })
  },[])

  const addIngredientHandler = useCallback( ingredient =>{
    httpDispatch({type:'SENT'})
    fetch('https://ingredients-list-71-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json',{
      method:'POST',
      body:JSON.stringify(ingredient),
      headers:{ 'Content-Type':'application/json' }
    }).then(response=>response.json())
    .then(data=>{
      httpDispatch({type:'RESPOND'})
      dispatch({
        type:'ADD',
        ingredient:{id:data.name,...ingredient}
      })
    }).catch(error=>{
      httpDispatch({
        type:'ERROR',
        error:'Something went wrong!😞'
      })
    })
  },[])

  const removeIngredientHandler = useCallback( ingridientId=>{
    httpDispatch({type:'SENT'})
    fetch(`https://ingredients-list-71-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${ingridientId}.json`,{
      method:'DELETE',
    }).then(response=>{
      // setIsLoading(false)
      httpDispatch({type:'RESPOND'})
      dispatch({
        type:'DELETE',
        id:ingridientId
      })
    }).catch(error=>{
      httpDispatch({
        type:'ERROR',
        errorMessage:'Something went wrong!😞'
      })
    })
    
  },[])

  const clearError=useCallback( ()=>{
    httpDispatch({type:'CLEAR'})
  },[])

  const ingredientList = useMemo(()=>{
    return(
      <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler}
        />
    )
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm 
        addIngredientHandler={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search  onSearch={onSearch}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
