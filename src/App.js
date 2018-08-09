import React, { Component } from 'react';
import FoodItem from "./components/FoodItem";
import FoodFocus from "./components/FoodFocus";
import MyFood from "./components/MyFood";
import FoodsTotal from "./components/FoodsTotal";
import Button from "./components/Button";
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
        let list = this.state.myFood;
        console.log(list);
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
      console.log(this.state.myFood);
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

  toFoodSearch = () => {
    let menu = this.state.menu;
    let keys = Object.keys(menu);
    for (let i = 0; i < keys.length; i++) {
      if (menu[keys[i]]) {
        menu[keys[i]] = false;
      }
    }
    menu["search"] = true;
    this.setState({
      menu: menu
    });
    this.loadSearch();
  }


  render() {

    let display = undefined;

    if (this.state.menu.intro){


      display = (
        <section id = "landing">
          <h1>
            Interested in better understanding your daily nutrition?
          </h1>
          <p>
            Maybe not that interested in
            number crunching and combing through nutrition labels? Still, maybe you
            would like a rough idea of where to start with your meal plans, or
            what foods to experiment with in reaching your health goals...
          </p>

          <h2>
            Here you have a place to start.
          </h2>
          <p>
            Look up foods you plan to enjoy during the day and see for yourself
            the macro and mineral composition based on 100g portions as reported
            by the United States Drug & Food Administration (USDA).
          </p>
          <p>
            Make a list of your desired foods and get suggestions for portion
            combinations based on a recommended daily caloric intake.
          </p>
          <p>
            Note that if you know your personal caloric goals you can
            personalize your recommended target. If you do not know a specific number,
            you can use the calculator to get a better ballpark sense. Keep in mind
            that nutrition can be more of an art than a science, feel free to experiment
            with your food choices!
          </p>
          <p>
            Caution: Please be aware that what is considered a 'healthy'
            weight can have different connotations based on who you ask (a health professional,
            a body positive person, an athlete, your next door neighbor Warren Peace-- who ironically
            actually has a very sensible middle-of-the-road outlook on controversial topics
            thanks in part to his coming to terms with the constant snickering suffered during his
            childhood years as a result of his namesake).
            In general, extreme weight (both low and high) increase health risks
            in different ways. Please exercise common sense when setting your targets,
            best of luck!
          </p>
          <Button
            name = "Get Started!"
            onClick = {this.toFoodSearch.bind(this)}
          />
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
