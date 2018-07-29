import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*global fetch*/

//USDA Food Composition Database
// @ https://ndb.nal.usda.gov/ndb/doc/index#
// Usage example:
// https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf&location=Denver+CO

const showFoodItems = (foodList) => {
  console.log(foodList);
  let foodItems = [];
  let inner = [];
  for (let i = 0; i < foodList.length; i++) {
    let info = foodList[i].name;
    if (!info.includes('\"\"') && !info.includes("!")) {
      info = info.slice(0, info.indexOf("UPC") - 2);
      let item = ((<li key = {foodList[i].id}>{info}</li>));
      inner.push(item);
    }
  }
  foodItems.push(<ul key = "wassup">{inner}</ul>);
  return foodItems;
}



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
        key: "U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf",
        error: null,
        isLoaded: false,
        foodComponents: [],
        search: ""
      };

  }

  updateSearch(event) {
    this.setState({
      search: event.target.value
    });
  }


  componentDidMount = () => {
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
        let newFoodComponents = showFoodItems(jsonRes.list.item);
        this.setState({
          isLoaded: true,
          foodComponents: newFoodComponents
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }


  render() {
    const {error, isLoaded, foodComponents} = this.state;
    let section;

    if (error) {
        section = ("Sorry there was a problem connecting to the web!")
      } else if (!isLoaded) {
        section = ("Loading, please wait...")
      } else {
          let filteredFood = [];
          if(this.state.search !== ""){
            filteredFood.push(foodComponents[0].props.children.filter(
              (food) => {
                return food.props.children.includes(this.state.search.toUpperCase());
              }
            ));
            section = (<ul>{filteredFood}</ul>);
          } else {
            section = foodComponents;
          }
      }

    return (

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <br/>
        <input type= "text" value = {this.state.search}
          onChange = {this.updateSearch.bind(this)}
        />
        <br/>
        <div className="App-intro scrollable">
          {section}
        </div>
      </div>
    );
  }
}

export default App;
