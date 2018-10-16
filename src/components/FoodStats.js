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
      totals: this.props.myFoodTotal,
      bg: {isLoaded: false, style: "hidden"}
    };
  }


  render(){
    let display;
    let bgStyle = {
      visibility: this.state.bg.style
    };
    let background = (
      <div
        id = "foodStats-bg"
        style = {bgStyle}
      >
      </div>
    );


    if (!this.state.bg.isLoaded) {
      display = (
        <div  id = "loading" key = "lock">
          <img src = {loading}/>
          <h1>
            You know the drill...
          </h1>
          {background}
        </div>
      );
    } else {
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
         <section className ="my-food" key = "door">
           {background}
           <div id = "stats-view">
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
           </div>
         </section>
       );
    }



    return(
      <TransitionGroup>
        <CSSTransition
          classNames = "fade"
          appear = {true}
          timeout = {1000}
          onEntered = {
            () =>{
              (!this.state.bg.isLoaded) ?
                this.setState({
                  bg: {isLoaded: true, style: "visible"}
                })
               : undefined
            }
          }
        >
          {display}
        </CSSTransition>
      </TransitionGroup>
    )
  }
}


export default FoodStats;
