import React, { Component } from 'react';


const FoodItem = (props) => {

  const handleClick = () => {
    props.click(props.id);
  }

  return (
    <li
      key = {props.id}
      onClick = {handleClick}
    >{props.children}</li>
  );


}


export default FoodItem;
