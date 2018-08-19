import React from 'react';





const MyFood = (props) => {

  let foodObject = JSON.parse(props.foodString);
  let name = foodObject.name;
  let macros = foodObject.userNutrients.proximates;
  let amount = foodObject.amount;
  let placeholder = "displaying values for " + amount + "g";



  const onClick = () => {
    props.removeFood(props.pos);
  }

  const onChange = (event) => {
    props.portionChange(props.pos, event);
  }

  return(
    <ul
    >
      <p className = "food-name">
        <span onClick = {onClick}> {name} </span>
      </p>
      <input
        onChange = {onChange}
        type = "number"
        name = "portion"
        placeholder = {placeholder}
        min = "50"
        max = "500"
        step = "50"
      />
      {macros.map((proximate, key) => <li key = {key}> {proximate} </li>)}
    </ul>
  )

}


export default MyFood;
