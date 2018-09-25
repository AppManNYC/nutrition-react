import React, { Component } from 'react';
import FoodItem from "./components/FoodItem";
import FoodFocus from "./components/FoodFocus";
import MyFood from "./components/MyFood";
import MyFoodTotals from "./components/MyFoodTotals";
import MyFoodDisclaimer from "./components/MyFoodDisclaimer";
import Button from "./components/Button";
import Transition from 'react-transition-group/Transition';
import './App.css';



import background from './assets/landing-bg.jpg'

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
        key: "U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf",
        foodComponents: {error: null, isLoaded: false, list: []},
        search: "",
        focus: {id: "", name: ""},
        myFood: [],
        myFoodTotal: [],
        userSettings: "",
        hook: {yes: false, no: false}
    };

  }

  updateSearch(event) {
    this.setState({
      search: event.target.value
    });
  }


  findFood = (id, name) => {
    this.setState({
      focus: {id: id, name: name}
    });
  }

  showFoodItems = (foodList) => {
    let foodItems = [];
    let inner = [];
    for (let i = 0; i < foodList.length; i++) {
      let info = foodList[i].name;
      if (!info.includes('\\') && !info.includes("!") &&
          !info.includes('""'))  {
        info = info.slice(0, info.indexOf("UPC") - 2);
        let list = this.state.myFood;
        let check = false;
        for (let i = 0; i < list.length; i++) {
          if (list.name === info) {
            check = true;
          }
        }
        let item;
        if (check) {
          item = ((<FoodItem
             className = "added"
             click= {this.findFood.bind(this)}
             id = {foodList[i].id}
             key = {foodList[i].id}>{info}</FoodItem>
           ));
        } else {
          item = ((<FoodItem
             click= {this.findFood.bind(this)}
             id = {foodList[i].id}
             key = {foodList[i].id}>{info}</FoodItem>
           ));
        }
        inner.push(item);
      }
    }
    foodItems.push(<ul key = "wassup">{inner}</ul>);
    return foodItems;
  }

  updateShowFoodItems = () => {

  }

  componentDidMount = () => {
  }

  loadSearch = () => {
    if (this.state.foodComponents.list.length === 0) {
      let listType = "f"; // food
      let url = "https://api.nal.usda.gov/ndb/list?" +
        "format=json" +
        "&lt=" + listType +
        "&max=" + 100 +
        "&api_key=" + this.state.key;

      fetch(url)
        .then( (response) => {
          return response.json();
        })
        .then( (jsonRes) =>  {
          let newFoodComponents = this.showFoodItems(jsonRes.list.item);
          this.setState({
            foodComponents: {isLoaded: true, list: newFoodComponents}
          });
        },
        (error) => {
          this.setState({
            foodComponents: {isLoaded: true, error: error}
          });
        }
      )
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

  portionChange = (position, event) => {
    let value = event.target.value*1;
    let foodList = this.state.myFood;
    let foodObject = foodList[position];

    let userNutrients = foodObject.userNutrients;

    if (value > 500) {
      value = 500;
      event.target.value = 500;
    }

    foodObject.amount = value;

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

    this.setState({
      myFood: foodList
    });
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
    this.loadSearch();
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
    console.log(this.state);
  }

  onSettingsChange = (newData) => {
    if (newData !== this.state.userData) {
      this.setState({
        userData: newData
      })
    }
  }

  render() {

    let display = undefined;

    if (this.state.menu.intro){




      display = (
        <div className = "App">
          <div id = "landing-bg">
          </div>
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
                <Button
                  name = "LEARN MORE"
                  onClick = {this.handleHookAffirm.bind(this)}
                />
                <Button
                  name = "NO"
                  onClick = {this.handleHookDeny.bind(this)}
                />
              </div> :
              ((this.state.hook.yes) ?
                <div id = "landing-info">
                  <p>
                    <span>Horn of Plenty</span> provides a way of visiualizing
                    caloric and nutritional contributions from each of the foods
                    you eat.
                  </p>
                  <p>
                    Here you can create and modify a food list of your preferred foods.
                    Based on food portions you choose, you will be shown total and
                    individual macronutrient information as reported by the USDA.
                  </p>
                  <p>
                    You can also choose to provide information regarding your nutritional
                    goals, and be shown more accurate information of the nutritional content
                    relative to your settings.
                  </p>

                  <Button
                    name = "GET STARTED"
                    onClick = {this.toFoodSearch.bind(this)}
                  />
                </div> :
                  <div id = "landing-info">
                    <p>
                      Fair enough!
                    </p>
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
      );


    } else if (this.state.menu.search) {
      const buildFoodList = () => {
        let section;
        let {error, isLoaded, list} = this.state.foodComponents;


        if (error) {
          section = ("Error: there was a problem connecting to the web");
        } else if (!isLoaded) {
          section = ("Loading, please wait...");
        } else {
            let filteredFood = [];
            if(this.state.search !== ""){
              filteredFood.push(list[0].props.children.filter(
                (food) => {
                  return food.props.children.includes(this.state.search.toUpperCase());
                }
              ));
              section = (
                <div>
                  <form>
                    <input type= "text" value = {this.state.search}
                        placeholder = "Search specific foods by name"
                        onChange = {this.updateSearch.bind(this)}
                    />
                  </form>
                  <div className="food-list scrollable">
                    <ul>{filteredFood}</ul>
                  </div>
                </div>
              );
            } else {
              section = (
                <div>
                  <form>
                    <input type= "text" value = {this.state.search}
                        placeholder = "Search specific foods by name"
                        onChange = {this.updateSearch.bind(this)}
                    />
                  </form>
                  <div className="food-list scrollable">
                    {list}
                  </div>
                </div>
              );
            }
        }
        return section;
      }
      let section;
      section = buildFoodList();
      let focusSection;
      focusSection = ((this.state.focus.id !== "") ?
        <FoodFocus
          addFood = {this.addToList.bind(this)}
          goToMyFoods = {this.toMyFood.bind(this)}
          name = {this.state.focus.name}
          id = {this.state.focus.id}/> : undefined);

      display = [];
      display.push(
        (<div>
          <br/>
            {section}
          <br/>
        </div>)
      );
      display.push(focusSection);
    } else if (this.state.menu.myFood) {
           let foodList = this.state.myFood;
           let myFoodSection = [];
           let myFoods = ((foodList.length > 0) ?
                <div className = "food-items scrollable">
                  {foodList.map((food, i) => <MyFood
                  total = {this.state.myFoodTotal}
                  key = {i}
                  foodString = {JSON.stringify(food)}
                  pos = {i}
                  portionChange = {this.portionChange.bind(this)}
                  removeFood = {this.removeFood.bind(this)} />)}
                </div> :
                  <p className = "dear"> Oh dear, you have no foods on your list! </p>
            );


            let myFoodTotals = ((foodList.length > 0) ?
              <MyFoodTotals
                changeSettings = {this.onSettingsChange.bind(this)}
                userSettings = {this.state.userSettings}
                foodList = {foodList}
                updateTotal = {this.updateFoodTotals.bind(this)}
              /> : undefined
            );

            let disclaimer = ((foodList.length > 0) ?
              <MyFoodDisclaimer/> :
                undefined
            );
            myFoodSection.push( myFoods);
            display = [];
            display.push(
              <section className ="my-food">
                <div className = "list-and-total">
                  <div className = "my-food-list">
                    <h2> My foods </h2>
                    {myFoodSection}
                    <Button
                      onClick = {this.toFoodSearch.bind(this)}
                      name = "Back to Search"
                    />
                  </div>
                  {myFoodTotals}
                </div>
                {disclaimer}
              </section>
            );
    }






    return (
      display
    );
  }
}

export default App;
