import React, { Component } from 'react';



import remove from '../assets/remove.png'
import incr from '../assets/increase.png'
import decr from '../assets/decrease.png'

class MyFood extends Component{

  constructor(props) {
    super(props);

    this.state = {
      tooltipHover: false
    };

  }




  handleMouseIn() {
    this.setState({ tooltipHover: true })
  }

  handleMouseOut() {
    this.setState({ tooltipHover: false })
  }



  onClick = () => {
    this.props.removeFood(this.props.pos);
  }

  onChange = (event) => {
    this.props.portionChange(this.props.pos, event);
  }

  increaseAmount = () => {
    this.props.portionIncr(this.props.pos)
  }

  decreaseAmount = () => {
    this.props.portionDecr(this.props.pos);
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
      opacity: this.state.tooltipHover ? '1' : '0'
    };

    const reverseStyle = {
      opacity: this.state.tooltipHover? '0' : '2'
    }

    const removeIconStyle = {
      opacity: this.state.tooltipHover? '1' : '0'
    }


    return(
      <div
        className = "food-container"
        onMouseOver = {this.handleMouseIn.bind(this)}
        onMouseOut = {this.handleMouseOut.bind(this)}
      >
        <div style = {reverseStyle}>
          <p onClick = {this.onClick.bind(this)} className = "food-name">
            <span> {name} </span>
            <img className = "remove-icon"
                 src = {remove}
                 alt = "remove this food"
                 style = {removeIconStyle}
             />
          </p>
          <div className = "input-container">
            <input
              onChange = {this.onChange.bind(this)}
              type = "number"
              name = "portion"
              placeholder = {placeholder}
              min = "50"
              max = "500"
            />
            <div className = "input-arrow-container">
              <img src = {incr} alt = "increase"
                onClick = {this.increaseAmount.bind(this)}
              />
              <img src = {decr} alt = "decrease"
                onClick = {this.decreaseAmount.bind(this)}
              />
            </div>
          </div>
          <ul>
            {macros.map((proximate, key) => <li key = {key}> {proximate} </li>)}
          </ul>
        </div>
        <div
          style = {tooltipStyle}
          className = "food-tooltip"
        >
          <ul>
            <li> <span>{energyPercent}%</span> of total kcals </li>
            <li> <span>{proteinPercent}%</span> of total protein </li>
            <li> <span>{fatPercent}%</span> of total fat </li>
            <li> <span>{fiberPercent}%</span> of total fiber </li>
            <li> <span>{sugarPercent}%</span> of total sugar </li>
          </ul>
        </div>


      </div>
    )
  }
}


export default MyFood;
