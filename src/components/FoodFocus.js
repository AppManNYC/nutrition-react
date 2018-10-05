import React , {Component} from 'react';
import Button from "./Button";

class FoodFocus  extends Component {

  constructor(props) {
    super(props);

    this.state = {
        key: "U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf",
        name: this.props.name,
        focus: {error: null, isLoaded: false, info: null},
        current: {name: this.props.name, id: this.props.id, nutrients: {}, ingredients: ""}
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

    fetch(url)
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
      },
      (error) => {
        this.setState({
          focus: {isLoaded: true, error: error}
        });
      }
    )
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

    section.push(<div className = "scrollable">
                 <div id = "macros">Macros: <ul>{macroSection}</ul></div>
                 <div id = "minerals">Minerals: <ul>{mineralSection}</ul></div></div>

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
        {name}
        <div className = "info">
          <div className = "ingredients">
            Ingredients
            <p className = "scrollable">
              {ingredientSection}
            </p>
          </div>
          <div className = "nutrients">
            Nutrients
              {nutrientSection}
          </div>
        </div>
      </section>
    );
    return section;
  }

  render() {
    let section;
    const buildFocus = () => {
      let section = [];
      let {error, isLoaded} = this.state.focus;

      if (error) {
          section = (
            <h1>
              Error: There was a problem connection to the web
            </h1>
          );
        } else if (!isLoaded) {
          section = (
            <h1>
              Loading, please wait...
            </h1>
          );
        } else {
          section.push(this.processFood());
          section.push(
            <Button
              onClick = {this.addToList.bind(this)}
              name = "add"
             />
          );
          section.push(
            <Button
              onClick = {this.props.goToMyFoods.bind(this)}
              name = "back"
            />
          );
        }
        return section;
    }

    section = buildFocus();

    return(
      <section id = "focus">
        {section}
      </section>
    );
  }


}

export default FoodFocus;
