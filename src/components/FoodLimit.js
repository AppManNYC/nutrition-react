import React, { Component } from 'react';
import Button from './Button'


class foodLimit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goal: {gain: false, maintain: true, lose: false},
      default: true,
      totalEnergyExpenditure: 0,
      data: {gender: "female",
             weight: 75.3,
             height: 1.6,
             activity: "moderate"
            },
      currentTotals: [],
      help: false
    }
  }


  handleMouseClick() {
    this.setState({ help: !this.state.help });
  }


changeState = (newProps) => {
  let newPropsString = JSON.stringify(newProps.totals);
  let oldStateString = JSON.stringify(this.state.currentTotals)

  if (newPropsString !== oldStateString) {
    this.setState({
      currentTotals: JSON.parse(newPropsString)
    });
  }

}

  componentDidMount() {
    this.changeState(this.props);
  }


  componentWillReceiveProps(newProps) {
    this.changeState(newProps);
  }

  processTotals() {
    let totalEnergyExpenditure;
    if (this.state.default) {
      totalEnergyExpenditure = 2250;
    } else {
      totalEnergyExpenditure = this.state.totalEnergyExpenditure;
    }


    let index;
    if (this.state.data.activity === "sedentary") {
      index = 0;
    } else if (this.state.data.activity === "moderate") {
      index = 1;
    } else if (this.state.data.activity === "high") {
      index = 2;
    }

    let goal;
    let goalMultiplier;
    if (this.state.goal.gain) {
      goalMultiplier = 1.15;
      goal = "weight gain";
    } else if (this.state.goal.maintain) {
      goalMultiplier = 1;
      goal = "weight maintainance";
    } else if (this.state.goal.lose) {
      goalMultiplier = .85;
      goal = "weight loss";
    }

    let weight = this.state.data.weight;

    let proteinLevels = [.79, 1.76];
    let fatLevels = [.6, 1.2];
    let carbLevels = [3.3 ,11.9];


    let protRange = [
      Math.round(proteinLevels[0]*weight*100)/100,
      Math.round(proteinLevels[1]*weight*100)/100
    ];

    let fatRange = [
      Math.round(fatLevels[0]*weight*100)/100,
      Math.round(fatLevels[1]*weight*100)/100
    ];

    let carbRange = [
      Math.round(carbLevels[0]*weight*100)/100,
      Math.round(carbLevels[1]*weight*100)/100
    ];


    let calorieSuggest = totalEnergyExpenditure*goalMultiplier;

    let currentTotals = this.state.currentTotals;

    let kcalsInfo = " At a " + goal + " goal of " + calorieSuggest + " kcals, you are ";

    if (currentTotals[0] > calorieSuggest) {
      kcalsInfo = kcalsInfo + "over by  " + (currentTotals[0] - calorieSuggest);
    } else {
      kcalsInfo = kcalsInfo + "under by " + ( calorieSuggest - currentTotals[0]);
    }

    let percent = Math.round(currentTotals[0]/calorieSuggest*100);
    kcalsInfo = kcalsInfo + " kcals (at " + percent +
                "% of recommended).";


    let protInfo = "At " + currentTotals[1] + "g ";
    let fatInfo = "At " + currentTotals[2] + "g ";
    let carbInfo = "At " + currentTotals[4] + "g ";
    let add = true;

    if (currentTotals[1] > protRange[0] && currentTotals[1] < protRange[1]) {
      protInfo += "you are within the recommended range of " + protRange[0] +
      " - " + protRange[1] + " grams of protein based on your weight.";
      add = false;
    } else if (currentTotals[1] < protRange[0]){
      percent = Math.round(currentTotals[1]/protRange[0]*100);
      protInfo += "you are below the minimum recommended " + protRange[0];
    } else if (currentTotals[1] > protRange[0]){
      percent = Math.round(currentTotals[1]/protRange[1]*100);
      protInfo += "you are above the maximum recommended " + protRange[1];
    }

    if (add) {
      protInfo += " grams of protein threshold (currently at " + percent +
      "% of recommended).";
      add = true;
    }



    if (currentTotals[2] > fatRange[0] && currentTotals[2] < fatRange[1]) {
      fatInfo += "you are within the recommended range of " + fatRange[0] +
      " - " + fatRange[1] + " grams of fat based on your weight.";
      add = false;
    } else if (currentTotals[2] < fatRange[0]){
      percent = Math.round(currentTotals[2]/fatRange[0]*100);
      fatInfo += "you are below the minimum recommended " + fatRange[0];
    } else if (currentTotals[2] > fatRange[1]){
      percent = Math.round(currentTotals[2]/fatRange[1]*100);
      fatInfo += "you are above the maximum recommended " + fatRange[1];
    }

    if (add) {
      fatInfo += " grams of fat threshold (currently at " + percent +
      "% of recommended).";
      add = true;
    }



    if (currentTotals[4] > carbRange[0] && currentTotals[3] < carbRange[1]) {
      carbInfo += "you are within the recommended range of " + carbRange[0] +
      " - " + carbRange[1] + " grams of carbs based on your weight.";
      add = false;
    } else if (currentTotals[4] < carbRange[0]){
      percent = Math.round(currentTotals[4]/carbRange[0]*100);
      carbInfo += "you are below the minimum recommended " + carbRange[0];
    } else if (currentTotals[4] > carbRange[1]){
      percent = Math.round(currentTotals[4]/carbRange[1]*100);
      carbInfo += "you are above the maximum recommended " + carbRange[1];
    }

    if (add) {
      carbInfo += " grams of carbs threshold (currently at " + percent +
      "% of recommended).";
    }


    let macroBreakdown = (
      <div>
        <p>
          The following are based on your personal information:
        </p>
        <p>
          {kcalsInfo}
        </p>
        <p>
          {protInfo}
        </p>
        <p>
          {fatInfo}
        </p>
        <p>
          {carbInfo}
        </p>
      </div>
    );

    return macroBreakdown;
  }

  render() {

    let section;
    if (this.state.default) {
      section = (
        <div>
          <p> Based on the default settings (see/change below),
            your approximate total energy expenditure is about <strong>2250 kcals</strong>.
          </p>
          {this.processTotals()}
        </div>
      );
    }

    const helptipStyle =  {
      display: this.state.help ? 'block' : 'none'
    };

    let how;
      how = ( <div>
        <span onClick = {this.handleMouseClick.bind(this)}> More info </span>
        <div id = "macro-help"
             style = {helptipStyle}
             onClick = {this.handleMouseClick.bind(this)}
        >
          <div>
            <h2>There are Many ways of calculting macro nurient ratios</h2>
            <fieldset>
              <legend> Calories </legend>
              <p>
                So please stay critical! One of most (historically) used
                methods is the Harris-Benedict equation (originally introduced in the early
                1900s but revised multiple times through the early 2000s)--
                due to its simplicity and relative accuracy.
              </p>
              <p>
                <strong>Note:</strong> this method is general and mostly applies for
                average body compositions (neither largely overweight nor largely underweight,
                not largely fat nor largely muscular). No difference is accounted for
                body fat percentage for instance. Use this as a starting point.
              </p>
              <p className = "equation">
                Basal Metabolic Rate<span>kcals</span> =
                (10 * weight<span>kg</span>) + (6.25 * height<span>cm</span>) -
                (5 * age<span>years</span>) + (constant<span>gender</span>).
                w/ constant<span>male</span> = 5 and
                constant<span>female</span> = -161
              </p>
              <p className = "equation">
                Then, Total Energy Expenditure<span>kcals</span> =
                BMR<span>kcals</span> * (Physical Activity Multiplier)

                where PAM could be between 1.5 (for low-sedentary activity) and
                2.25 (for highly extensive daily exertion)
              </p>
              <p>
                TEE assumes weight maintenance. For loss or gain, +- 10 - 20% is recommended.
              </p>
            </fieldset>
            <fieldset>
              <legend> Macro ratios </legend>
              <p>
                As for carbohydrate, protein, and fat ratios, these depend on
                personal body composition, age, and a ton of other factors. We perform
                crude approximations based on the following ranges and information about
                activity level/goals.
              </p>
              <p>
                <strong>For proteins</strong>, intake ratios range from .79 to 1.76 grams per kg
                of bodyweight. With the higher end recommended for weight
                loss and muscle gain goals.
              </p>
              <p>
                <strong>In terms of fat</strong>, recommended ratios are .6 - 1.2 grams per kg of
                bodyweight. Keep in mind however that this ratio will be
                doubled or tripled for ketogenic diets (and carb ratio will
                proportionally decreased).
              </p>
              <p>
                <strong>For carbs</strong>, the recommended values range from 3.3 to 11.9
                grams per kg of bodyweight. The value will depend on many things,
                but most importantly physical activity levels and diabetic conditions.
              </p>
            </fieldset>
            <p>
              Some secondary literature readings:
              <ul>
                <li> <a href = "https://shapescale.com/blog/health/nutrition/calculate-macronutrient-ratio"> One </a> </li>
                <li> <a href = "http://sportsmedicinebhs.weebly.com/nutrition-guidelines.html"> Two </a> </li>
              </ul>


            </p>
          </div>
        </div>
      </div>);




    return(

      <div id = "food-limit">
        <h2>Breakdown suggestions:</h2>
        {section}
        {how}
        <Button name = "Change your settings"/  >
      </div>



    )
  }



}


export default foodLimit;
