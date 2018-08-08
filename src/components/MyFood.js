import React from 'react';





const MyFood = (props) => {

  let foodObject = JSON.parse(props.foodString);
  let name = foodObject.name;
  let macros = foodObject.nutrients.proximates;

  const onClick = () => {
    props.removeFood(props.pos);
  }

  return(
    <ul
      onClick = {onClick}
    >
      <span> {name} </span>
      {macros.map(proximate => <li> {proximate} </li>)}
    </ul>
  )

}


export default MyFood;
