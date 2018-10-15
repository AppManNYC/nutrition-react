import React from 'react';


const FoodItem = (props) => {

  const handleClick = () => {
    props.click(props.id, props.children);
  }

  return (
    <li
      key = {props.id}
      onClick = {handleClick}
    >
      {props.children}
    </li>
  );
}


export default FoodItem;
