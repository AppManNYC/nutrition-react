import React, { Component } from 'react';
import Button from './Button'
import ProgressBar from './ProgressBar';


import star from '../assets/star.png'


class foodLimit extends Component {
  constructor(props) {
    super(props);

    if (this.props.userSettings !== "") {
      let newSettings = JSON.parse(this.props.userSettings);
      this.state = newSettings;
    } else {
      this.state = {
        selfReported: false,
        goal: "maintain",
        set: true,
        default: true,
        suggestedCalories: 2250,
        data: {units: "metric", // metric for calculations, but input can be imperial or metric
               gender: "female", // biological, apologies to my non binary non cis attack-helicopter kin
               age: 20,      // age minimum of 18 for legal reasons
               weight: 75.3, //kilograms, but input is either lbs or kg
               height: 1.6,  // m but input is either ft or m
               activity: "moderate"  // either low, moderate, or high
              },
        currentTotals: [],
        help: false,
        settings: {menu: false, own: false, calculator: false},
      }
    }
  }

  handleMouseClick() {
    this.setState({ help: !this.state.help });
  }

  handleMouseClick2() {
    this.setState({ settings: {...this.state.settings, menu: !this.state.settings.menu} });
  }

  handleMouseClick3() {
    this.setState({
      selfReported: true,
      set: false,
      settings: {...this.state.settings,
                               own: true,
                               calculator: false}
    });
  }

  handleMouseClick4() {
    this.setState({
      selfReported: false,
      set: false,
      settings: {...this.state.settings,
                               calculator: true,
                               own: false}
    });
  }


  handleUnitChange(event) {
    this.setState({ data: {...this.state.data,
                           units: event.target.value}
    });
  }

  handleGenderChange(event) {
    this.setState({
      data: {...this.state.data,
             gender: event.target.value}
    });
  }

  handleWeight(event) {
    let newWeight = event.target.value;
    if (this.state.data.units !== "metric") {
      newWeight = Math.round(newWeight*(.4536)*100)/100;
    }
    this.setState({
      data: {...this.state.data,
             weight: newWeight}
    });
  }

  handleHeight(event) {
    let newHeight = event.target.value;
    if (this.state.data.units !== "metric") {
      newHeight = Math.round(newHeight*(.3048)*100)/100;
    }
    this.setState({
      data: {...this.state.data,
             height: newHeight}
    });
  }


  handleAge(event) {
    this.setState({
      data: {...this.state.data,
             age: event.target.value}
    });
  }

  handleActivity(event) {
    this.setState({
      data: {...this.state.data,
             activity: event.target.value}
    });
  }

  handleGoal(event) {
    this.setState({
      goal: event.target.value
    });
  }

  calculateCalories() {
    let weight = this.state.data.weight
    let height = this.state.data.height*100;
    let age = this.state.data.age;
    let gender = this.state.data.gender;
    let constant;
    if (gender === "female") {
      constant = -161;
    } else if (gender === "male") {
      constant = 5;
    }
    let activityLevel = this.state.data.activity;
    let physicalActivityMultiplier;
    if (activityLevel === "low"){
      physicalActivityMultiplier = 1.5;
    } else if (activityLevel === "moderate"){
      physicalActivityMultiplier = 1.88;
    } else if (activityLevel === "high") {
      physicalActivityMultiplier = 2.25;
    }
    let goal = this.state.goal;
    let goalMultiplier;

    if (goal === "lose") {
      goalMultiplier = .85;
    } else if (goal === "maintain") {
      goalMultiplier = 1;
    } else if(goal === "gain") {
      goalMultiplier = 1.15;
    }


    let basalMetabolicRate = (10*weight) + (6.25*height) - (5*age) + constant;
    let totalEnergyExpenditure = basalMetabolicRate*physicalActivityMultiplier;
    let dailyIntake = totalEnergyExpenditure*goalMultiplier;
    dailyIntake = Math.round(dailyIntake);

    return(dailyIntake);
  }

  handleSet() {

    let units = this.state.data.units;
    let gender = this.state.data.gender;
    let height = this.state.data.height;
    let weight = this.state.data.weight;
    let age = this.state.data.age;
    let activity = this.state.data.activity;
    let goal = this.state.goal;


    let promptText;
    if (this.state.settings.calculator) {
      promptText = "Just to make sure:" + "\n" + " Your gender is " + gender +
      " and it has been " + age + " earthly rotations around the sun " +
      "since the auspicious day whence you were born. " + "\n \n" +
      "Your input is in " + units + " units " +
      "which means your height is " + height + "m and weight is " + weight +
      "kg. Your activity level is " + activity + " and ultimately your goal is " +
      "to " + goal +" weight. \n \n Did we get that right?" +
      "\n \n Note: Canceling will revert to the default suggestions.";
    } else if (this.state.settings.own) {
      promptText = "Just to make sure: \nYou've chosen to report your weight" +
      " in " + units + " units, which means that at "  + weight + "kg " +
      "your chosen daily Caloric intake will be " +
      this.state.suggestedCalories + "kcals. \nIs this correct?" +
      " \n \n Note: Canceling will revert back to default suggestions."
    }





    let goOn = window.confirm(promptText);

    if (goOn) {

      let newSuggestion;
      if (this.state.selfReported) {
        newSuggestion = this.state.suggestedCalories;
      } else {
        newSuggestion = this.calculateCalories();
      }

      this.setState({
        default: false,
        set: true,
        suggestedCalories: newSuggestion,
        settings: {menu: false, own: false, calculator: false}
      });

      let newSettings = JSON.stringify(this.state);
      this.props.changeSettings(newSettings);
    } else {
      this.setState({
        selfReported: false,
        set: true,
        default: true,
        suggestedCalories: 2250,
        goal: "maintain",
        data: {units: "metric",
               gender: "female",
               age: 20,
               weight: 75.3,
               height: 1.6,
               activity: "moderate"
             },
       settings: {menu: false, own: false, calculator: false}
      });
    }

  }


  handleOwnCals = (event) => {
    this.setState({
      default: false,
      suggestedCalories: event.target.value
    });
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

    let goal;
    if (this.state.goal === "gain") {
      goal = "weight gain";
    } else if (this.state.goal === "maintain") {
      goal = "weight maintainance";
    } else if (this.state.goal === "lose") {
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


    let calorieSuggest = this.state.suggestedCalories;

    let currentTotals = this.state.currentTotals;

    let excess;
    if (currentTotals[0] > calorieSuggest) {
      excess = "Over by  " + (currentTotals[0] - calorieSuggest);
    } else {
      excess = "Under by " + ( calorieSuggest - currentTotals[0]);
    }

    let percent = Math.round(currentTotals[0]/calorieSuggest*100);


    let kcalsInfo = (
      <div className = "macro-suggestion">
        <strong> Calories: </strong>
        <ProgressBar
          set = {this.state.set}
          target = {calorieSuggest}
          currentKcals = {currentTotals[0]}
        />
        Currently at {percent}% of recommended ({excess} kcals.)
      </div>
    );



    if (currentTotals[1] > protRange[0] && currentTotals[1] < protRange[1]) {
      percent = false;
      excess = "You are within the recommended range of " + protRange[0] +
      " - " + protRange[1] + " grams";
    } else if (currentTotals[1] < protRange[0]){
      percent = Math.round(currentTotals[1]/protRange[0]*100*100)/100;
      excess= "lower recommended threshold  of " + protRange[0] ;
    } else if (currentTotals[1] > protRange[0]){
      percent = Math.round(currentTotals[1]/protRange[1]*100*100)/100;
      excess= "higher recommended threshold of " + protRange[1];
    }



    let protInfo = ((currentTotals[1] > 0) ?
      <div className = "macro-suggestion">
        <strong> Proteins: </strong>
        <ProgressBar
          set = {this.state.set}
          lowerBound = {protRange[0]}
          upperBound = {protRange[1]}
          currentGrams = {currentTotals[1]}
        />
        {percent ?   <div className = "not-within-goal">
           <img className = "fade-out" src = {star}/>
          {"Currently at " + percent + "% of " + excess + " grams"}
         </div>:
        <div className = "within-goal">
         <img className = "fade-in" src= {star}
           alt = "An image of a star. Good Job!"/>
           {excess}
        </div>
        }
      </div> : <div className = "macro-suggestion">
          <strong> Proteins: </strong>
          <p> Zero! </p>
        </div>
    );




    if (currentTotals[2] > fatRange[0] && currentTotals[2] < fatRange[1]) {
      percent = false;
      excess = "You are within the recommended range of " + fatRange[0] +
      " - " + fatRange[1] + " grams";
    } else if (currentTotals[2] < fatRange[0]){
      percent = Math.round(currentTotals[2]/fatRange[0]*100*100)/100;
      excess= "lower recommended threshold  of " + fatRange[0] ;
    } else if (currentTotals[2] > fatRange[0]){
      percent = Math.round(currentTotals[2]/fatRange[1]*100*100)/100;
      excess= "higher recommended threshold of " + fatRange[1];
    }

    let fatInfo = ((currentTotals[2] > 0) ?
      <div className = "macro-suggestion">
        <strong> Fats: </strong>
        <ProgressBar
          set = {this.state.set}
          lowerBound = {fatRange[0]}
          upperBound = {fatRange[1]}
          currentGrams = {currentTotals[2]}
        />
        {percent ?   <div className = "not-within-goal">
           <img className = "fade-out" src = {star}/>
          {"Currently at " + percent + "% of " + excess + " grams"}
         </div>:
        <div className = "within-goal">
         <img className = "fade-in" src= {star}
           alt = "An image of a star. Good Job!"/>
           {excess}
        </div>
        }
      </div> : <div className = "macro-suggestion">
          <strong> Fats: </strong>
          <p> Nada! </p>
        </div>
    );

    if (currentTotals[4] > carbRange[0] && currentTotals[4] < carbRange[1]) {
      percent = false;
      excess = "You are within the recommended range of " + carbRange[0] +
      " - " + carbRange[1] + " grams";
    } else if (currentTotals[4] < carbRange[0]){
      percent = Math.round(currentTotals[4]/carbRange[0]*100*100)/100;
      excess= "lower recommended threshold  of " + carbRange[0] ;
    } else if (currentTotals[4] > carbRange[1]){
      percent = Math.round(currentTotals[4]/carbRange[1]*100);
      excess= "higher recommended threshold of " + carbRange[1];
    }

    let carbInfo = ((currentTotals[4] > 0) ?
      <div className = "macro-suggestion">
        <strong> Carbs: </strong>
        <ProgressBar
          set = {this.state.set}
          lowerBound = {carbRange[0]}
          upperBound = {carbRange[1]}
          currentGrams = {currentTotals[4]}
        />
        {percent ? <div className = "not-within-goal">
           <img className = "fade-out" src = {star}/>
          {"Currently at " + percent + "% of " + excess + " grams"}
         </div>
         :
         <div className = "within-goal">
          <img className = "fade-in" src= {star}
            alt = "An image of a star. Good Job!"/>
            {excess}
         </div>
        }
      </div> : <div className = "macro-suggestion">
          <strong> Carbs: </strong>
          <p>  Zilch! </p>
        </div>
    );

    let macroBreakdown = (
      <div>
        <p>
          {this.state.default? "The following information is based" +
            " on the default settings." : "The following are based on " +
            "your provided information."
          }
        </p>
        <p>
          <strong> Daily Caloric Intake goal: </strong> {this.state.suggestedCalories} kcals
          {" "}
          <strong>Current weight: </strong> {this.state.data.weight} kg
        </p>
          {kcalsInfo}
          {protInfo}
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

    let section = this.processTotals();


    const helptipStyle =  {
      display: this.state.help ? 'block' : 'none'
    };

    let how;
      how = ( <div>
        <Button onClick = {this.handleMouseClick.bind(this)} name = "More info"/>
        <div id = "macro-help"
             style = {helptipStyle}
             onClick = {this.handleMouseClick.bind(this)}
        >
          <div>
            <h2>There are a many ways of calculting macro nurient ratios</h2>
            <div id = "field-container"
              className = "scrollable"
            >
              <fieldset>
                <legend> Calories </legend>
                <p>
                  One of most widely used
                  methods is the Harris-Benedict equation (originally introduced in the early
                  1900s but revised multiple times through the early 2000s). This equation
                  is relatively accurate but more importantly uses simple markers such as
                  height, weight, and age.
                </p>
                <p>
                  <strong>Note:</strong> The HB eqn is an approximation and is most accurate
                  for average body types (i.e. not extremely massive nor extremely light)
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
                  but most importantly physical activity levels conditions such as
                  diabetes.
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
        </div>
      </div>);

      const settingsStyle =  {
        display: this.state.settings.menu ? 'block' : 'none'
      };

      const ownStyle =  {
        display: this.state.settings.own ? 'block' : 'none'
      };

      const calculatorStyle =  {
        display: this.state.settings.calculator ? 'block' : 'none'
      };


      let settings;
      settings = (
        <div>
          <Button name = "Change Settings" onClick = {this.handleMouseClick2.bind(this)} />
          <div id = "settings"
            style = {settingsStyle}
          >
            <div>
              <h2> Change your settings here </h2>
              <section>

                <Button name = "Set your own goal"
                  onClick = {this.handleMouseClick3.bind(this)}
                  disabled = {this.state.settings.own}
                />
                <Button name = "Use the calculator"
                  onClick = {this.handleMouseClick4.bind(this)}
                  disabled = {this.state.settings.calculator}
                />
                <form>
                  <label> Imperial </label>
                  <input className = "radio-btn"
                    type = "radio" name = "unit"
                    value = "imperial"
                    onChange = {this.handleUnitChange.bind(this)}
                  />
                  <label> Metric </label>
                  <input className = "radio-btn"
                    checked
                    type = "radio" name = "unit"
                    value = "metric"
                    onChange = {this.handleUnitChange.bind(this)}
                  />
                </form>
                <form id = "calculator"
                  style = {calculatorStyle}
                  className = "scrollable"
                >

                  Gender:
                  <label> Female </label>
                  <input className = "radio-btn"
                          checked = {this.state.data.gender === "female"}
                          type = "radio" name = "gender" value = "female"
                          onChange = {this.handleGenderChange.bind(this)}
                  />
                  <label> Male </label>
                  <input className = "radio-btn"
                         checked = {this.state.data.gender === "male"}
                         type = "radio" name = "gender" value = "male"
                         onChange = {this.handleGenderChange.bind(this)}
                  />

                  <br/>
                  <label> Weight: </label>
                  <input type = "number"
                         name = "weight"
                         placeholder = "in kg or lbs"
                         min = "0"
                         value = {this.state.data.weight}
                         onChange = {this.handleWeight.bind(this)}
                  />
                  <br/>
                  <label> Height: </label>
                  <input type = "number"
                         name = "height"
                         placeholder = "in ft or m"
                         step = ".01"
                         min = "0"
                         value = {this.state.data.height}
                         onChange = {this.handleHeight.bind(this)}
                  />
                  <br/>
                  <label> Age: </label>
                  <input type = "number"
                         name = "age"
                         placeholder = "in years"
                         min = "18"
                         value = {"" + this.state.data.age}
                         onChange = {this.handleAge.bind(this)}/>

                  Activity levels:
                  <label> Low  </label>
                  <input className = "radio-btn"
                         type = "radio"
                         name = "activity" value = "low"
                         checked = {this.state.data.activity === "low"}
                         onChange = {this.handleActivity.bind(this)}
                  />
                  <label> Moderate </label>
                  <input className = "radio-btn"
                         type = "radio"
                         name = "activity" value = "moderate"
                         checked = {this.state.data.activity === "moderate"}
                         onChange = {this.handleActivity.bind(this)}
                  />
                  <label> High </label>
                  <input className = "radio-btn"
                         type = "radio"
                         name = "activity" value = "high"
                         checked = {this.state.data.activity === "high"}
                         onChange = {this.handleActivity.bind(this)}
                  />
                  <br/>
                  Weight goals:
                  <label> Loss </label>
                  <input className = "radio-btn"
                         type = "radio"
                         name = "goal" value = "lose"
                         checked = {this.state.goal === "lose"}
                         onChange = {this.handleGoal.bind(this)}
                  />
                  <label> Maintenance </label>
                  <input className = "radio-btn"
                         type = "radio"
                         name = "goal" value = "maintain"
                         checked = {this.state.goal === "maintain"}
                         onChange = {this.handleGoal.bind(this)}
                  />
                  <label> Gain </label>
                  <input className = "radio-btn"
                         type = "radio"
                         name = "goal" value = "gain"
                         checked = {this.state.goal === "gain"}
                         onChange = {this.handleGoal.bind(this)}
                  />
                </form>

                <form id = "own-calories" style = {ownStyle}>
                  <label> Caloric intake goal: </label>
                  <input type = "number"
                    name = "kcals"
                    step = "50"
                    min = "0"
                    value = {this.state.suggestedCalories}
                    placeholder = "daily value in kcals"
                    onChange = {this.handleOwnCals.bind(this)}
                  />
                  <label> Weight: </label>
                  <input type = "number"
                         name = "weight"
                         step = "5"
                         placeholder = "in kg or lbs"
                         value = {this.state.data.weight}
                         min = "0"
                         onChange = {this.handleWeight.bind(this)}
                  />
                </form>
                <Button name = "Set" onClick = {this.handleSet.bind(this)}/>
              </section>
            </div>
          </div>
        </div>

      );


    return(
     <div>
        <div id = "food-limit" className = "scrollable">
          {this.props.children}
          {section}
        </div>
        <div id = "settings-info">
          {settings}
          {how}
        </div>
     </div>
    )
  }
}


export default foodLimit;
