import React, { Component } from 'react';
import FoodLimit from "./FoodLimit";



class MyFoodTotals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      foodList: [],
      energy: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    };


  }



  calculateTotals = ( newProps) => {

    let newPropsString = JSON.stringify(newProps.foodList);
    let oldStateString = JSON.stringify(this.state.foodList);
    if (newPropsString !== oldStateString) {

      let totals = undefined;
      let foodList = newProps.foodList;

      let energy = 0;
      let protein = 0;
      let fat = 0;
      let fiber = 0;
      let sugar = 0;

      for(let i = 0; i < foodList.length; i++) {
        let food = foodList[i];
        let proximates = food.userNutrients.proximates;

        for (let i = 0; i < proximates.length; i++) {
          let quantity = parseFloat(proximates[i].match("([0-9]+((\.)[0-9]{1,2})?)")[0]);


          if (proximates[i].includes("Energy")) {
            energy = energy + quantity;
          } else if (proximates[i].includes("Protein")){
            protein +=  quantity;
          } else if (proximates[i].includes("Total lipid")) {
            fat += quantity;
          } else if (proximates[i].includes("Fiber,")) {
            fiber += quantity;
          } else if (proximates[i].includes("Sugars, total")) {
            sugar += quantity;
          }
        }
      }

      energy = Math.round(energy * 100) / 100;
      protein = Math.round(protein * 100) / 100;
      fat = Math.round(fat * 100) / 100;
      fiber = Math.round(fiber * 100) / 100;
      sugar = Math.round(sugar * 100) / 100;

      let newTotal = [energy, protein, fat, fiber, sugar];
      let foodListCopy = JSON.parse(JSON.stringify(newProps.foodList));



      newProps.updateTotal(newTotal);
      this.setState({
        foodList: foodListCopy,
        energy : energy,
        protein: protein,
        fat: fat,
        fiber: fiber,
        sugar: sugar
      });
    }
  }


  componentDidMount = () => {
    this.calculateTotals(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.calculateTotals(newProps);
  }




 render() {


   let totals = (
     <div>
       Totals:
       <ul>
         <li> Energy: {this.state.energy}kcal</li>
         <li> Protein: {this.state.protein}g </li>
         <li> Fats (lipids): {this.state.fat}g </li>
         <li> Fiber: {this.state.fiber}g </li>
         <li> Sugars (carbs): {this.state.sugar}g </li>
       </ul>
     </div>
   )

   return(
     <div id = "my-food-totals">
       <h2> Totals based on your chosen food: </h2>
       {totals}
       <FoodLimit
        totals = {[this.state.energy,
                   this.state.protein,
                   this.state.fat,
                   this.state.fiber,
                   this.state.sugar]}
       />
     </div>
   );
 }
}

export default MyFoodTotals;
