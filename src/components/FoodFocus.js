import React , {Component} from 'react';
import Button from "./Button";

import {TransitionGroup, CSSTransition} from 'react-transition-group';

class FoodFocus  extends Component {

  constructor(props) {
    super(props);

    this.state = {
        key: "U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf",
        name: this.props.name,
        focus: {error: null, isLoaded: false, info: null},
        current: {name: this.props.name, id: this.props.id, nutrients: {}, ingredients: ""},
        inTest: true
      };

  }

  addToList = () => {
    this.props.addFood(JSON.stringify(this.state.current));
  }


  getNutrients =(nutrients) => {
    let nutrientsObj = {proximates: [], minerals: []}
    let proximates = [];
    let minerals = [];

    for (let i = 0; i < nutrients.length; i++) {
      if (nutrients[i].group === "Proximates") {
        proximates.push(nutrients[i]);
      } else if (nutrients[i].group === "Minerals") {
        minerals.push(nutrients[i]);
      }
    }


    for (let i = 0; i < proximates.length; i++) {
      if (!proximates[i].name.includes("Carbohydrate")) {
        let entry = proximates[i].name + ": " + proximates[i].value + proximates[i].unit;
        nutrientsObj.proximates.push(entry);
      }
    }



    for (let i = 0; i < minerals.length; i++) {
      let entry = minerals[i].name + ": " + minerals[i].value + minerals[i].unit;
      nutrientsObj.minerals.push(entry);
    }

    return nutrientsObj;
  }



  componentWillReceiveProps(newProps) {
  if (newProps.name !== this.props.name) {
    this.setState({
      name: newProps.name,
      focus: {error: null, isLoaded: false, info: null},
      current: {name: newProps.name, id: newProps.id, ...this.state.current}
    });
    this.fetchFocus(newProps);
  }
}


  fetchFocus = (props) => {
    let url = "https://api.nal.usda.gov/ndb/V2/reports?" +
      "format=json" +
      "&ndbno=" + props.id +
      "&type=f" +
      "&api_key=" + this.state.key;

    fetch(url, {signal: this.abortController.signal})
      .then( (response) => {
        return response.json();
      })
      .then( (jsonRes) =>  {

        let food = jsonRes.foods[0].food;
        let ingredients = food.ing.desc;
        let nutrients = food.nutrients;
        let nutrientsObj = this.getNutrients(nutrients);
        this.setState({
          focus: {isLoaded: true, info: jsonRes},
          current: {name: props.name, id: props.id, nutrients: nutrientsObj, ingredients: ingredients}
        });
    })
    .catch( error => {
      if (error.name === 'AbortError'){
        return
      }
      this.setState({
        focus: {isLoaded: true, error: error}
      });
    });
  }


  componentDidMount = () => {
    this.fetchFocus(this.props);
  }



  processIngredients = () => {
    let ingredients = this.state.current.ingredients;
    let section = [];

    if (ingredients.length === 0) {
      section.push(<p> No additional ingredients </p>);
    } else {
      let ingredientArray = ingredients.split(".");
      for (let i = 0; i < ingredientArray.length; i++) {

        section.push(<span className = "ing-group"> {ingredientArray[i]} </span>)
      }
    }

    return section;
  }


  processNutrients = () => {

    let macros = this.state.current.nutrients.proximates;
    let minerals = this.state.current.nutrients.minerals;



    let macroSection = [];
    let mineralSection = [];

    let section = [];

    for (let i = 0; i < macros.length; i++) {
      macroSection.push(<li className = "proximates"> {macros[i]}
      </li>);
    }

    for (let i = 0; i < minerals.length; i++) {
      mineralSection.push(<li className = "minerals">{minerals[i]}</li>);
    }

    section.push(
      <div>
        <div id = "macros">
          <h3>Macros: </h3>
          <div className = "scrollable"><ul>{macroSection}</ul></div>
        </div>
        <div id = "minerals">
          <h3>Minerals: </h3>
          <div className = "scrollable"><ul>{mineralSection}</ul></div>
        </div>
      </div>
    );
    return section;
  }


  processFood = () => {
    let name = this.state.name.trim();


    let ingredientSection = this.processIngredients();
    let nutrientSection = this.processNutrients();


    let section;
    section = (
      <section>
        <h1>{name}</h1>
        <div className = "info">
          <div className = "nutrients">
              {nutrientSection}
          </div>
          <div className = "ingredients">
            <h2>Ingredients</h2>
            <div className = "scrollable">
              {ingredientSection}
            </div>
          </div>
        </div>
          <Button
            onClick = {this.addToList.bind(this)}
            name = "add"
           />
           <Button
             onClick = {this.props.goToMyFoods}
             name = "back"
           />
        <div id = "buttons">
        </div>
      </section>
    );
    return section;
  }


  componentWillUnmoun(){
    this.abortController.abort();
  }

  abortController = new window.AbortController();

  render() {
    let section;
    const buildFocus = () => {
      let section = [];
      let {error, isLoaded} = this.state.focus;

      if (error) {
          section = (
            <h4>
              Error: There was a problem connection to the web
            </h4>
          );
        } else if (!isLoaded) {
          section = (
            <CSSTransition
              key = "is this a key?... You bet!"
              in = {true}
              appear = {true}
              classNames = "fade-fast"
              timeout = {300, 200}
            >
              <h4>
                Loading, please wait...
              </h4>
            </CSSTransition>
          );
        } else {
          section = (
            <CSSTransition
              key = "this is a key!"
              classNames = "grow"
              appear = {true}
              in = {true}
              timeout = {500}
            >
              {this.processFood()}
            </CSSTransition>
          );
        }
        return section;
    }

    section = buildFocus();

    return(
      <section id = "focus">
        <TransitionGroup>
          {section}
        </TransitionGroup>
      </section>
    );
  }


}

export default FoodFocus;
