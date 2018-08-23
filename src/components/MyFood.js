import React, { Component } from 'react';




class MyFood extends Component{

  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };

  }




  handleMouseIn() {
    this.setState({ hover: true })
  }

  handleMouseOut() {
    this.setState({ hover: false })
  }



  onClick = () => {
    this.props.removeFood(this.props.pos);
  }

  onChange = (event) => {
    this.props.portionChange(this.props.pos, event);
  }


  render() {

    let foodObject = JSON.parse(this.props.foodString);
    let name = foodObject.name;
    let macros = foodObject.userNutrients.proximates;
    let amount = foodObject.amount;
    let placeholder = "displaying values for " + amount + "g";
    let totals = this.props.total;
    let energyPercent;
    let proteinPercent;
    let fatPercent;
    let fiberPercent;
    let sugarPercent;


    for (let i = 0; i < macros.length; i++) {

      let quantity = parseFloat(macros[i].match("([0-9]+((\.)[0-9]{1,2})?)")[0]);
      quantity = Math.round(quantity * 100) / 100;

      if (macros[i].includes("Energy")) {
        if (quantity !== 0) {

          energyPercent = quantity / totals[0] * 100;
          energyPercent = Math.round(energyPercent * 100) / 100;
        } else {
          energyPercent = 0;
        }
      } else if (macros[i].includes("Protein")){
        if (quantity !== 0) {
          proteinPercent =  quantity / totals[1] * 100;
          proteinPercent = Math.round(proteinPercent * 100) / 100;
        } else {
          proteinPercent = 0;
        }
      } else if (macros[i].includes("Total lipid")) {
        if (quantity !== 0) {
          fatPercent =  quantity / totals[2] * 100;
          fatPercent = Math.round(fatPercent * 100) / 100;
        } else {
          fatPercent = 0;
        }
      } else if (macros[i].includes("Fiber,")) {
        if (quantity !== 0) {
          fiberPercent =  quantity / totals[3] * 100;
          fiberPercent = Math.round(fiberPercent * 100) / 100;
        } else {
          fiberPercent = 0;
        }
      } else if (macros[i].includes("Sugars, total")) {
        if (quantity !== 0) {
          sugarPercent =  quantity / totals[4] * 100;
          sugarPercent = Math.round(sugarPercent * 100) / 100;
        } else {
          sugarPercent = 0;
        }
      }
    }






    const tooltipStyle =  {
      display: this.state.hover ? 'block' : 'none'
    };


    return(
      <ul
        onMouseOver = {this.handleMouseIn.bind(this)}
        onMouseOut = {this.handleMouseOut.bind(this)}
      >
        <p className = "food-name">
          <span onClick = {this.onClick.bind(this)}> {name} </span>
        </p>
        <div
          style = {tooltipStyle}
          className = "food-tooltip"
        >
          <ul>
            Currently:
            <li> {energyPercent}% of total kcals </li>
            <li> {proteinPercent}% of total protein </li>
            <li> {fatPercent}% of total fat </li>
            <li> {fiberPercent}% of total fiber </li>
            <li> {sugarPercent}% of total sugar </li>
          </ul>
        </div>
        <input
          onChange = {this.onChange.bind(this)}
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
}


export default MyFood;
