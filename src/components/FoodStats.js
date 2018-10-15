import React, {Component} from 'react';
import MyFood from "./MyFood";
import MyFoodTotals from "./MyFoodTotals";
import MyFoodDisclaimer from "./MyFoodDisclaimer";
import Button from "./Button";
import {CSSTransition, TransitionGroup} from 'react-transition-group';


import loading from '../assets/wedges-loading.svg';

class FoodStats extends Component {

  constructor(props) {
    super(props);

    this.state = {
      myFood: this.props.myFood,
      totals: this.props.myFoodTotal
    };
  }


  render(){
    let display;
    let foodList = this.state.myFood;
    let myFoodSection = [];
    let myFoods = ((foodList.length > 0) ?
         <div className = "food-items scrollable">
           {foodList.map((food, i) => <MyFood
           total = {this.state.totals}
           key = {i}
           foodString = {JSON.stringify(food)}
           pos = {i}
           portionChange = {this.props.portionChange}
           removeFood = {this.props.removeFood} />)}
         </div> :
           <p className = "dear"> Oh dear, you have no foods on your list! </p>
     );


     let myFoodTotals = ((foodList.length > 0) ?
       <MyFoodTotals
         changeSettings = {this.props.onSettingsChange}
         userSettings = {this.props.userSettings}
         foodList = {foodList}
         updateTotal = {this.props.updateFoodTotals}
       /> : undefined
     );

     let disclaimer = ((foodList.length > 0) ?
       <MyFoodDisclaimer/> :
         undefined
     );
     myFoodSection.push( myFoods);
     display = (
       <section className ="my-food">
         <div className = "list-and-total">
           <div className = "my-food-list">
             <h2> My foods </h2>
             {myFoodSection}
             <Button
               onClick = {this.props.toFoodSearch}
               name = "Back to Search"
             />
           </div>
           {myFoodTotals}
         </div>
         {disclaimer}
       </section>
     );

    return(
      <TransitionGroup>
        {display}
      </TransitionGroup>
    )
  }
}


export default FoodStats;
