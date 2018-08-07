import React from 'react';





const MyFood = (props) => {

  let foodObject = JSON.parse(props.foodString);
  console.log(foodObject);
  let name = foodObject.name;
  let macros = foodObject.nutrients.proximates;

  const onClick = () => {
    this.props.removeFood(this.props.pos);
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
