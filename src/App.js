import React, { Component } from 'react';
import FoodItem from "./components/FoodItem";
import FoodFocus from "./components/FoodFocus";
import MyFood from "./components/MyFood";
import MyFoodTotals from "./components/MyFoodTotals";
import MyFoodDisclaimer from "./components/MyFoodDisclaimer";
import Button from "./components/Button";
import './App.css';

/*global fetch*/

// USDA Food Composition Database
// @ https://ndb.nal.usda.gov/ndb/doc/index#
// Usage example:
// https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf&location=Denver+CO


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
        myFoodTotal: []
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
    let menu = this.state.menu;
    let keys = Object.keys(menu);
    for (let i = 0; i < keys.length; i++) {
      if (menu[keys[i]]) {
        menu[keys[i]] = false;
      }
    }
    menu[keys[index]] = true;
    this.setState({
      menu: menu
    });
  }


  toFoodSearch = () => {
    this.toSpecificMenu(1);
    this.loadSearch();
  }

  toMyFood = () => {
    this.toSpecificMenu(2)
  }

  render() {

    let display = undefined;

    if (this.state.menu.intro){


      display = (
        <section id = "landing">
          <div id = "landing-info">
            <h1>
              Interested in better understanding your daily nutrition?
            </h1>
            <p>
              Not looking forward to combing through nutrition labels and
              number crunching?
            </p>
            <p>
              Would like a rough idea of where to start in modifying your meal plans?
            </p>
            <h2>
              Here you have a place to start.
            </h2>
            <p>
              Search for foods you plan to enjoy during the day and see for yourself
              macro and mineral nutrient composition based on 100g portions as reported
              by the United States Drug & Food Administration (USDA).
            </p>
            <p>
              Make a list of your desired foods and receive suggestions for portion
              combinations based on a recommended daily caloric intake.
            </p>
            <Button
              name = "Get Started!"
              onClick = {this.toFoodSearch.bind(this)}
            />
          </div>

          <div>
            <p className = "landing-disclaimer">
              <strong>Note</strong> if you know what your personal caloric goals are you can
              personalize your recommended target. If you do not,
              feel free to use the calculator to get a better ballpark sense. Keep in mind
              that nutrition can be an obscure art, get creative and
              experiment!
            </p>
            <p className = "landing-disclaimer">
              <strong>Caution:</strong> Please be aware that what is considered a 'healthy'
              weight can have different connotations based on who you ask (a health professional,
              a body positive person, an athlete, your next door neighbor Warren Peace-- who incidentally
              has a very sensible middle-of-the-road outlook on controversial subjects, perhaps
              in part due to coming to terms with the constant gnawing snickering from peers
              as a result of his namesake).
              In general, extreme weight (both low and high) increases health risks
              in different ways. Please exercise common sense when setting your targets,
              best of luck!
            </p>
          </div>

        </section>
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
              section = (<ul>{filteredFood}</ul>);
            } else {
              section = list;
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
          <form>
            <input type= "text" value = {this.state.search}
                onChange = {this.updateSearch.bind(this)}
            />
          </form>
          <br/>
          <section className="food-list scrollable">
            {section}
          </section>
          <br/>
        </div>)
      );
      display.push(focusSection);
    } else if (this.state.menu.myFood) {
           let foodList = this.state.myFood;
           let myFoodSection = [];
           let myFoods = ((foodList.length > 0) ?
                foodList.map((food, i) => <MyFood
                total = {this.state.myFoodTotal}
                key = {i}
                foodString = {JSON.stringify(food)}
                pos = {i}
                portionChange = {this.portionChange.bind(this)}
                removeFood = {this.removeFood.bind(this)} />) :
                <p> oh dear, you have no foods on your list! </p>
            );


            let myFoodTotals = (
              <MyFoodTotals
                foodList = {foodList}
                updateTotal = {this.updateFoodTotals.bind(this)}
              />
            );

            let disclaimer = ((foodList.length > 0) ?
              <MyFoodDisclaimer/> :
                undefined
            );
            myFoodSection.push(<div className = "food-items scrollable"> {myFoods} </div>);
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
                <div className = "recommendations">
                  YO we heard you like recommendations so we recommended you some recommendations
                </div>

              </section>
            );
    }






    return (

      <div className="App">
        <header>
          <h1 className="App-title">nutrition-react</h1>
        </header>
        {display}
      </div>
    );
  }
}

export default App;
