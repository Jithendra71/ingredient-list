import React, { useState } from 'react';
import { useEffect, useRef } from 'react/cjs/react.development';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [searched,setSearched]=useState('')
  const {onSearch} =props
  const inputref =useRef()
  useEffect(()=>{
    const timer = setTimeout(()=>{
      if(searched !== inputref.current.value){
        return ()=>{ clearTimeout(timer) }}
      fetch('https://ingredients-list-71-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json')
      .then(response=>response.json())
      .then(data=>{
        const prevIngredients =[]
        for(const key in data){
          prevIngredients.push({
            id:key,
            title: data[key].title,
            amount:data[key].amount
          })
        }
        onSearch(
          prevIngredients.filter(
            ingredient=>ingredient.title.includes(searched)))
      })
    },500)
  },[searched,onSearch,inputref])
  
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputref}
            type="text" 
            value={searched} 
            onChange={event=>setSearched(event.target.value)} 
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
