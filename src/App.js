import React, { Component } from 'react';
import FoodSearch from "./components/FoodSearch";
import FoodStats from "./components/FoodStats";
import Button from "./components/Button";
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './App.css';



import loading from './assets/wedges-loading.svg';

// USDA Food Composition Database
// @ https://ndb.nal.usda.gov/ndb/doc/index#
// Usage example:
// https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf&location=Denver+CO


/*global fetch*/


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
        menu: {intro: true, search: false, myFood: false, profile: false},
        apiData: null,
        search: "",
        focus: {id: "", name: ""},
        myFood: [],
        myFoodTotal: [],
        userSettings: "",
        hook: {yes: false, no: false},
        bg: {loaded: false, visibility: "hidden"}
    };

  }

  saveAPICall = (list) => {
    let currentList = this.state.apiData;
    if (currentList !== list) {
      this.setState({
        apiData: list
      });
    }
  }

  addToList = (foodString) => {
    let currentList = this.state.myFood;
    let err = false;
    let foodStringName = JSON.parse(foodString).name
    for (let i = 0; i < currentList.length; i++) {
      if (currentList[i].name === foodStringName) {
        err = true;
      }
    }

    if (!err) {
      let foodObject = JSON.parse(foodString);
      foodObject.amount = 100;
      let userNutrientsString = JSON.stringify(foodObject.nutrients);
      let userNutrients = JSON.parse(userNutrientsString);
      foodObject.userNutrients = userNutrients;
      currentList.push(foodObject);
      this.setState({
        myFood: currentList
      });
    }
  }

  removeFood = (position) => {
    if (window.confirm("Remove this food?")) {
      let foodList = this.state.myFood;
      foodList.splice(position,1);
      this.setState({
        myFood: foodList
      });
    }
  }




  portionChangeMath = (value, position) => {
    let foodList = this.state.myFood;
    let foodObject = foodList[position];
    let userNutrients = foodObject.userNutrients


    for (let i = 0; i < foodObject.nutrients.minerals.length; i++) {
      let originalAmountPer100g = foodObject.nutrients.minerals[i].match("([0-9]+((\.)[0-9]{1,2})?)")[0];
      let newAmount = (value/100)*originalAmountPer100g;
      newAmount = Math.round(newAmount * 100) /100;
      userNutrients.minerals[i] = foodObject.nutrients.minerals[i].replace(originalAmountPer100g, newAmount);
    }

    for (let i = 0; i < foodObject.nutrients.proximates.length; i++) {
      let originalAmountPer100g = foodObject.nutrients.proximates[i].match("([0-9]+((\.)[0-9]{1,2})?)")[0];
      let newAmount = (value/100)*originalAmountPer100g;
      newAmount = Math.round(newAmount * 100) /100;
      userNutrients.proximates[i] = foodObject.nutrients.proximates[i].replace(originalAmountPer100g, newAmount);
    }


    foodObject.userNutrients = userNutrients;
    foodList[position] = foodObject;
    foodObject.amount = value;

    this.setState({
      myFood: foodList
    });
  }

  portionDecr = (position) => {
    let foodList = this.state.myFood;
    let foodObject = foodList[position];

    let currentAmount = foodObject.amount;
    let value = currentAmount - 50;
    if(value < 0){
      value = 0;
    }
    this.portionChangeMath(value, position);
  }

  portionIncr = (position) => {
    let foodList = this.state.myFood;
    let foodObject = foodList[position];

    let currentAmount = foodObject.amount;
    let value = currentAmount + 50;
    if(value > 500){
      value = 500;
    }
    this.portionChangeMath(value, position);
  }

  portionChange = (position, event) => {
    let value = event.target.value*1;
    let foodList = this.state.myFood;

    if (value > 500) {
      value = 500;
      event.target.value = 500;
    }

    this.portionChangeMath(value, position);
  }

  updateFoodTotals = (newTotal) => {
    this.setState({
      myFoodTotal: newTotal
    });
  }

  toSpecificMenu = (index) => {
    // ["intro", "search", "myFood", "profile"]
    let hook = this.state.hook;
    if (index === 0) {
      hook.yes = false;
      hook.no = false;
    }
    let menu = this.state.menu;
    let keys = Object.keys(menu);
    for (let i = 0; i < keys.length; i++) {
      if (menu[keys[i]]) {
        menu[keys[i]] = false;
      }
    }
    menu[keys[index]] = true;
    this.setState({
      menu: menu,
      hook: hook
    });
  }


  toFoodSearch = () => {
    this.toSpecificMenu(1);
  }

  toMyFood = () => {
    this.toSpecificMenu(2)
  }


  handleHookAffirm = () => {
    this.setState({
      hook: {yes: true, no: false}
    });
  }

  handleHookDeny = () => {
    this.setState({
      hook: {yes: false, no: true}
    });
  }

  onSettingsChange = (newData) => {
    if (newData !== this.state.userData) {
      this.setState({
        userData: newData
      })
    }
  }

  handleBgLoad = () => {
    this.setState({
      bg: {loaded: true, style: "visible" }
    });
  }


  render() {

    let display = undefined;

    let bgStyle = {
      visibility: this.state.bg.visibility
    };

    let background = (
      <div
        id = "landing-bg"
        style = {bgStyle}
      >
      </div>
    );

    if (!this.state.bg.loaded) {
      display = (
          <div key = "alpha" className = "App" id = "loading">
            <img src = {loading}/>
            <h1>
              Welcome!
            </h1>
            {background}
          </div>
      );
    } else {
      if (this.state.menu.intro){
        display = (
        <CSSTransition
          classNames = "fade"
          appear = {true}
          timeout = {1000}
          in = {true}
        >
          <div key = "bravo" className = "App">
            {background}
            <section id = "landing">
              <header className = "enter-left">
                <h1> HORN OF PLENTY</h1>
              </header>
              {(!this.state.hook.yes && !this.state.hook.no) ?
                <div className = "hook">
                  <h1 id = "left">
                    Looking to better understand your daily nutrition?
                  </h1>
                  <h1 id = "right">
                    A place to start modifying your meal plans?
                  </h1>
                  <div id = "buttons">
                    <Button
                      name = "LEARN MORE"
                      onClick = {this.handleHookAffirm.bind(this)}
                    />
                    <Button
                      name = "NO"
                      onClick = {this.handleHookDeny.bind(this)}
                    />
                  </div>

                </div> :
                ((this.state.hook.yes) ?
                  <div id = "landing-info">
                    <h1 id = "left">
                      <span>Horn of Plenty</span> provides a way of visiualizing
                      caloric and nutritional contributions from each of the foods
                      you eat.
                    </h1>
                    <h1 id = "right">
                      Here you can create and modify a food list of your preferred foods.
                      Based on food portions you choose, you will be shown total and
                      individual macronutrient information as reported by the USFDA.
                    </h1>
                    <h1 id = "left">
                      You can also choose to provide information regarding your nutritional
                      goals, and be shown more accurate information of the nutritional content
                      relative to your settings.
                    </h1>

                    <Button
                      name = "GET STARTED"
                      onClick = {this.toFoodSearch.bind(this)}
                    />
                  </div> :
                    <div id = "landing-info">
                      <h1>
                        Fair enough!
                      </h1>
                      <Button
                        name = "Bye!"
                        onClick = {() => {this.toSpecificMenu(0)}}
                      />
                    </div>
                )
              }
              <footer id = "landing-disclaimer">
                <p>
                  <strong>Note</strong> Nutrition can seem an obscure art. Horn of Plenty
                  can help provide a starting point, and hopefully make the process less
                  daunting. Ultimately you will have to find what
                  works for you. Please be creative and experiment!
                </p>
                <p>
                  <strong>Caution:</strong> Please be aware that what is considered a 'healthy'
                  weight can have different connotations based on who you ask (a health professional,
                  a body positive person, an athlete, your next door neighbor-- who incidentally
                  has a very sensible middle-of-the-road outlook on controversial topics, what
                  a good bloke).
                  In general, extreme weight (both low and high) increases health risks
                  in different ways. Please exercise common sense when setting your targets,
                  best of luck!
                </p>
              </footer>
            </section>
          </div>
        </CSSTransition>
        );
      } else if (this.state.menu.search) {
        display = (
          <FoodSearch
            key = "foodKeyYum"
            addFood = {this.addToList.bind(this)}
            toMyFood = {this.toMyFood.bind(this)}
            myFood = {this.state.myFood}
            saveCall = {this.saveAPICall.bind(this)}
            savedData = {this.state.apiData}
          />
        );
      } else if (this.state.menu.myFood) {
            display = (
              <FoodStats
                myFood = {this.state.myFood}
                myFoodTotal = {this.state.myFoodTotal}
                userSettings = {this.state.userSettings}
                portionChange = {this.portionChange.bind(this)}
                portionIncr = {this.portionIncr.bind(this)}
                portionDecr = {this.portionDecr.bind(this)}
                removeFood = {this.removeFood.bind(this)}
                onSettingsChange = {this.onSettingsChange.bind(this)}
                updateFoodTotals = {this.updateFoodTotals.bind(this)}
                toFoodSearch = {this.toFoodSearch.bind(this)}
                key = "foodStatisticsInOnlyTwoSimpleStepsTheUnabridgedGuide"
              />
            );
      }
    }

    return (
      <TransitionGroup>
        <CSSTransition
          classNames = "fade"
          appear = {true}
          timeout = {1000}
          onEntered = {
            () =>{
              (!this.state.bg.loaded) ?
                this.setState({
                  bg: {loaded: true, visibility: "visible"}
                }) : undefined
            }
          }
        >
          {display}
        </CSSTransition>
      </TransitionGroup>

    );
  }
}

export default App;
