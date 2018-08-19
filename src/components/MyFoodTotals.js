import React, { Component } from 'react';



class MyFoodTotals extends Component {

  constructor(props) {
    super(props);
    this.state = {
      foodList: this.props.foodList,
      energy: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    };


  }



  calculateTotals = () => {
    let totals = undefined;
    let foodList = this.state.foodList;

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
        quantity = Math.round(quantity * 100) /100;
        console.log(quantity);

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

    this.setState({
      energy : energy,
      protein: protein,
      fat: fat,
      fiber: fiber,
      sugar: sugar
    });

  }

  componentDidMount = () => {
    this.calculateTotals();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.foodList !== this.foodList) {
      this.setState({
        foodList: newProps
      });
    }
    this.calculateTotals();

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
     </div>
   );
 }
}

export default MyFoodTotals;
