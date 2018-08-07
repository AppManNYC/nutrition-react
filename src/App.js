import React, { Component } from 'react';
import FoodItem from "./components/FoodItem";
import FoodFocus from "./components/FoodFocus";
import MyFood from "./components/MyFood";
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
    }
  }

  removeFood = (position) => {
    console.log(position);
  }


  render() {
    let section;

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


     let foodList = this.state.myFood;
     let myFoodSection = ((foodList.length > 0) ?
          foodList.map((food, i) => <MyFood
          key = {i}
          foodString = {JSON.stringify(food)}
          pos = {i}
          removeFood = {this.removeFood.bind(this)} />): undefined
      );
    return (

      <div className="App">
        <header>
          <h1 className="App-title">nutrition-react</h1>
        </header>
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
        {focusSection}
        <br/>
        <section className ="my-food scrollable">
          {myFoodSection}
        </section>
      </div>
    );
  }
}

export default App;
