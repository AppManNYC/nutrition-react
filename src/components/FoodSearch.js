import React, {Component} from 'react';
import Button from "./Button";
import FoodFocus from "./FoodFocus";
import FoodItem from "./FoodItem";

import {CSSTransition} from 'react-transition-group';
import bg from '../assets/foodlist-bg.jpg';
import loading from '../assets/wedges-loading.svg';
import magni from '../assets/magnifying.png';

class FoodSearch extends Component {

  constructor(props){
    super(props);

    this.state = {
      key: "U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf",
      foodComponents: {error: null, isLoaded: false, list: []},
      search: "",
      focus: {id: "", name: ""},
      myFood: props.myFood,
      bg: {isLoaded: false, style: "hidden"}
    };
  }

  // When triggered sends a copy of the api call to parent.
  saveData = () => {
    this.props.saveCall(JSON.stringify(this.state.foodComponents.list));
  }


  //  Updates state based on user input. The search input then can be
  // used to update the food display.
  updateSearch(event) {
    this.setState({
      search: event.target.value
    });
  }


  // onClick unction for food items. When clicked, change state to remember
  // the food name and id.
  findFood = (id, name) => {
    this.setState({
      focus: {id: id, name: name}
    });
  }

  // Helper function to process API data. Takes JSON format object and
  // returns the food items inside an unordered list of list jsx.
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

  // Commences the API fetch, calls function helper function
  // showFoodItems to process the API response into a presentable format.
  // Updates state based on response.
  loadSearch = () => {
    console.log("Api fetch started");
    if (this.state.foodComponents.list.length === 0  ) {
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
          if (this.state.bg.isLoaded) {
            this.setState({
              foodComponents: {isLoaded: true, list: newFoodComponents},
              foodListBg: {isLoaded: true, style: "visible"}
            });
          } else {
            this.setState({
              foodComponents: {isLoaded: true, list: newFoodComponents}
            });
          }
          this.saveData();
        },
        (error) => {
          this.setState({
            foodComponents: {isLoaded: true, error: error}
          });
        }
      )
    }
  }

  // onLoad for background, updates state to signal background is ready
  handleBgLoad = () => {
    if (this.state.foodComponents.isLoaded) {
      this.setState({
        bg: {isLoaded: true, style: "visible"}
      });
    } else {
      this.setState({
        bg: {...this.state.bg, isLoaded: true}
      });
    }
  }

  // Based on state, arrange the jsx UI.
  buildView = () => {
    let section;
    let {error, isLoaded, list} = this.state.foodComponents;
    if (error) {
      section = (<h1> Error: there was a problem connecting to the web </h1>);
    } else {
        let filteredFood = [];
        if(this.state.search !== ""){
          filteredFood.push(list[0].props.children.filter(
            (food) => {
              return food.props.children.includes(this.state.search.toUpperCase());
            }
          ));
          section = (
            <div id = "food-list-container">
              <div className="food-list scrollable">
                {filteredFood[0].length === 0 ?
                  <h1> No such food!  </h1> :
                  <ul>{filteredFood}</ul>
                }
              </div>
            </div>
          );
        } else {
          section = (
            <div id = "food-list-container">
              <h1>FOOD LIST</h1>
              <div className="food-list scrollable">
                {list}
              </div>
            </div>
          );
        }
    }
    return section;
  }


  componentDidMount() {
    let list = JSON.parse(this.props.foodAPIList);
    if (list.length !== 0) {
      this.setState({
        foodComponents: {isLoaded: true, list: list}
      });
    } else {
      this.loadSearch();
    }
  }

  render() {

    let display;

    let bgStyle = {
      visibility: this.state.bg.style,
      position: "absolute",
      width: "100%",
      height: "auto"
    };
    let background = (
      <div
        style = {bgStyle}
      >
        <img id = "foodlist-bg"
          src = {bg}
          onLoad = {this.handleBgLoad.bind(this)}
        />
      </div>
    );

    if ( !this.state.foodComponents.isLoaded || !this.state.bg.isLoaded) {
      display = (
        <div id = "loading">
          <img src = {loading}/>
          <h1>
            Loading, please wait...
          </h1>
          {background}
        </div>
      );
    } else {
      let section;
      section = this.buildView();
      let focusSection;
      focusSection = ((this.state.focus.id !== "") ?
        <FoodFocus
          addFood = {this.props.addFood}
          goToMyFoods = {this.props.toMyFood}
          name = {this.state.focus.name}
          id = {this.state.focus.id}
        /> : undefined
      );

      let searchBar = (
        <form>
            <div id = "search-bar-container">
              <input type= "text" value = {this.state.search}
                    placeholder = "Search specific foods by name"
                    onChange = {this.updateSearch.bind(this)}
               />
                <img src = {magni} alt = "Search bar"/>
             </div>
          </form>
      );

      display = (
        <div id = "food-list-page">
          {background}
          <div id = "food-list-view">
            {searchBar}
            <div id = "section-focus">
              {section}
              {focusSection}
            </div>
          </div>
        </div>
      );
    }


    return(
      display
    );
  }
}

export default FoodSearch;
