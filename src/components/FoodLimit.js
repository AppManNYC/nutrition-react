import React, { Component } from 'react';


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

    let goalMultiplier;
    if (this.state.data.goal.gain) {
      goalMultiplier = 1.15;
    } else if (this.state.data.goal.maintain) {
      goalMultiplier = 1;
    } else if (this.state.data.goal.lose) {
      goalMultiplier = .85;
    }

    let proteinLevels = [.79, 1.28, 1.76];
    let fatLevels = [.6, .9, 1.2];
    let carbLevels = [3.3, 7.6 ,11.9];


    let calorieSuggest;
    let overCalories;
    if (this.state.currentTotals[0] < totalEnergyExpenditure*goalMultiplier ||
        this.state.currentTotals[0] > totalEnergyExpenditure*goalMultiplier) {
          calorieSuggest = false;
          
        } else {
          caloriesuggest = true;
        }

  }

  render() {

    console.log(this.state.currentTotals);
    let section;
    if (this.state.default) {
      section = (<p> Based on the default suggestion for the average female (see/change below),
          the suggested target for weight maintenance is 2250 kcals.</p>
      );
    }

    const helptipStyle =  {
      display: this.state.help ? 'block' : 'none'
    };

    let how;
      how = ( <div>
        <span onClick = {this.handleMouseClick.bind(this)}>???</span>
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
                average body compositions (not largely overweight or largely underweight,
                not largely fat or largely muscular). No difference is accounted for
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
                TEE assumes weight maintenance. For loss or gain, (+- 10-20% is recommended)
              </p>
            </fieldset>
            <fieldset>
              <legend> Macro ratios </legend>
              <p>
                As for carbohydrate, protein, and fat ratios, these depend on
                personal body composition, age, and a ton of other factors.
              </p>
              <p> For proteins, intake ratios range from .79 to 1.76 grams per kg
                of bodyweight. With the higher end recommended for weight
                loss and muscle gain goals.
              </p>
              <p>
                In terms of fat, the recommended are .6 - 1.2 grams per kg of
                bodyweight. Keep in mind however that this ratio will be
                doubled or tripled for ketogenic diets (and carb ratio will
                proportionally decreased).
              </p>
              <p>
                For carbs, the recommended values range from 3.3 to 11.9
                grams per kg of bodyweight. The value will depend on many things,
                but most importantly physical activity levels and diabetic conditions.
              </p>
            </fieldset>
            <p>
              Some secondhand readings:
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
        {how}
        {section}
      </div>



    )
  }



}


export default foodLimit;
