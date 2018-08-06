import React , {Component} from 'react';
import Button from "./Button";

class FoodFocus  extends Component {

  constructor(props) {
    super(props);

    this.state = {
        key: "U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf",
        name: this.props.name,
        focus: {error: null, isLoaded: false, info: null},
        current: ""
      };

  }
  componentWillReceiveProps(newProps) {
  if (newProps.name !== this.props.name) {
    this.setState({
      name: this.props.name,
      focus: {error: null, isLoaded: false, info: null}
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

        let newState = this.state.focus;
        newState.isLoaded = true;
        newState.info = jsonRes;
        this.setState({
          focus: newState
        });
      },
      (error) => {
        let newState = this.state.focus;
        newState.isLoaded = true;
        newState.error = error;
        this.setState({
          focus: newState
        });
      }
    )
  }


  componentDidMount = () => {
    this.fetchFocus(this.props);
  }



  processIngredients = (ingredients) => {
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


  processNutrients = (nutrients) => {
    let section = [];

    let proximates = [];
    let minerals = [];

    for (let i = 0; i < nutrients.length; i++) {
      if (nutrients[i].group === "Proximates") {
        proximates.push(nutrients[i]);
      } else if (nutrients[i].group === "Minerals") {
        minerals.push(nutrients[i]);
      }
    }

    let macros = [];

    for (let i = 0; i < proximates.length; i++) {
      if (!proximates[i].name.includes("Carbohydrate")) {
        macros.push(<li className = "proximates"> {proximates[i].name}:
           {proximates[i].value}{proximates[i].unit}
        </li>);
      }
    }

    let minComp = [];
    for (let i = 0; i < minerals.length; i++) {
      minComp.push(<li className = "minerals"> {minerals[i].name}:
         {minerals[i].value}{minerals[i].unit}
      </li>);
    }

    section.push(<div className = "scrollable">
                 <div id = "macros">Macros: <ul>{macros}</ul></div>
                 <div id = "minerals">Minerals: <ul>{minComp}</ul></div></div>

    );
    return section;
  }


  processFood = () => {
    let name = this.state.name.trim();
    let food = this.state.focus.info.foods[0].food;

    let ingredients = food.ing.desc;
    let ingredientSection = this.processIngredients(ingredients);

    let nutrients = food.nutrients;
    let nutrientSection = this.processNutrients(nutrients);


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
          section = ("Sorry there was a problem connecting to the web!");
        } else if (!isLoaded) {
          section = ("Loading, please wait...");
        } else {
          section.push(this.processFood());
          section.push(<Button name ="add"/>);
        }
        return section;
    }

    section = buildFocus();

    return(
      <section className = "focus">
        {section}
      </section>
    );
  }


}

export default FoodFocus;
