import React, { Component } from 'react';
import FoodItem from "./components/FoodItem";
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
        focus: {error: null, isLoaded: false, info: null}
      };

  }




  updateSearch(event) {
    this.setState({
      search: event.target.value
    });
  }


  findFood = (id) => {
    this.setState({
      focus: id
    });
  }

  showFoodItems = (foodList) => {
    let foodItems = [];
    let inner = [];
    for (let i = 0; i < foodList.length; i++) {
      let info = foodList[i].name;
      if (!info.includes('\"\"') && !info.includes("!")) {
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
    if (this.state.foodComponents.list === []) {
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
          let newState = this.state.foodComponents;
          newState.isLoaded = true;
          newState.list = newFoodComponents
          this.setState({
            foodComponents: newState
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    } else if (this.state.focus) {

    }


  }


  render() {
    const {error, isLoaded, list} = this.state.foodComponents;
    let section;

    if (error) {
        section = ("Sorry there was a problem connecting to the web!")
      } else if (!isLoaded) {
        section = ("Loading, please wait...")
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

    return (

      <div className="App">
        <header className="App-header">
          <h1 className="App-title">nutrition-react</h1>
        </header>
        <br/>
        <input type= "text" value = {this.state.search}
          onChange = {this.updateSearch.bind(this)}
        />
        <br/>
        <div className="App-intro scrollable"   >
          {section}
        </div>
      </div>
    );
  }
}

export default App;
