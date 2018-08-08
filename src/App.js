import React, { Component } from 'react';
import FoodItem from "./components/FoodItem";
import FoodFocus from "./components/FoodFocus";
import MyFood from "./components/MyFood";
import FoodsTotal from "./components/FoodsTotal"
import './App.css';

/*global fetch*/

//USDA Food Composition Database
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
        myFood: []
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
        let item = ((<FoodItem
           click= {this.findFood.bind(this)}
           id = {foodList[i].id}
           key = {foodList[i].id}>{info}</FoodItem>
         ));
        inner.push(item);
      }
    }
    foodItems.push(<ul key = "wassup">{inner}</ul>);
    return foodItems;
  }


  componentDidMount = () => {
    if (this.state.foodComponents.list.length === 0 &&
        this.state.menu.search === true) {
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
    for (let i = 0; i < currentList.length; i++) {
      if (JSON.stringify(currentList[i]) === foodString) {
        err = true;
      }
    }

    if (!err) {
      let foodObject = JSON.parse(foodString);
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


  render() {


    let display = undefined;

    if (this.state.menu.intro){
      let section;

      section = (
        <section>
          <h1>
            Welcome!
          </h1>
          <p>
            Are you interested in being more conscientious about the food that goes
            into fueling your daily life? Are you maybe not that interested in
            number crunching and combing through nutrition labels? Still, maybe you
            would like a rough idea of where to start with your meal plans, or
            what foods to experiment with in reaching your health goals.
          </p>

          <h2>
            Here you have a place to start.
          </h2>
          <p>
            Look up the foods you consume during the day and check for yourself
            the macro and mineral composition based on 100g portions as reported
            by the United States Drug & Food Administration (USDA).
          </p>
          <p>
            Make a list of your chosen foods and get suggestions for portion
            combinations to reach a recommended average daily caloric intake amount.
          </p>
          <p>
            Please note that if you know your personal caloric goals you can change
            this amount. If you do not know a specific number, you can use the calculator
            to get a better ballpark number. As always keep in account that none
            of this is an exact science and recommendations can vary wildly between
            individuals.
          </p>
          <p>
            As a final disclaimer, please be aware that what is considered a 'healthy'
            weight can have different connotations based on who you ask (a health professional,
            a body positive person, an athlete, Joe the next door neighbor). In general greater
            weight numbers (relative to height/age/physical activity) have been well correlated
            in literature with greater propensity for adverse health conditions. In the same vein,
            very low weight numbers can also be problematic. Please exercise common sense when
            setting and hustling towards your goals. Best of luck!
          </p>
        </section>
      );


    } else if (this.state.menu.search) {
      const buildFoodList = () => {
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

      section = buildFoodList();
      let focusSection;

      focusSection = ((this.state.focus.id !== "") ?
        <FoodFocus
          addFood = {this.addToList.bind(this)}
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
          <section className="food-list scrollable"   >
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
                key = {i}
                foodString = {JSON.stringify(food)}
                pos = {i}
                removeFood = {this.removeFood.bind(this)} />): undefined
            );

            let myFoodsTotal = ((foodList.length > 0) ?
              <FoodsTotal
                foods = {JSON.stringify(foodList)}
              /> : undefined
            );
            myFoodSection.push(myFoods);
            myFoodSection.push(myFoodsTotal);
            display = [];
            display.push(
              <section className ="my-food scrollable">
                {myFoodSection}
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
