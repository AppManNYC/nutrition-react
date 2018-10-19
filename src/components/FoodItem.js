import React from 'react';



import check from '../assets/check.png'


const FoodItem = (props) => {

  const handleClick = () => {
    props.click(props.id, props.children);
  }

  return (
    <li
      className = {(props.check)? "added" : undefined}
      key = {props.id}
      onClick = {handleClick}
    >
      {props.children}
      {(props.check) ?
        (<img id = "check"
              src = {check}
              alt = "added!"
              className = "fade-in"
         />): undefined
      }
    </li>
  );
}


export default FoodItem;
