import React , {Component} from 'react';

class FoodFocus  extends Component {

  constructor(props) {
    super(props);

    this.state = {
        key: "U1gJ9CuAZPIkNOqFxeKfI7jOat1RPYwUj5gbTsjf",
        name: this.props.name,
        focus: {error: null, isLoaded: false, info: null},
      };

  }
  componentWillReceiveProps() {
  this.setState({
    name: this.props.name,
    focus: {error: null, isLoaded: false, info: null}
  });
  this.fetchFocus();
}


  fetchFocus = () => {
    let url = "https://api.nal.usda.gov/ndb/V2/reports?" +
      "format=json" +
      "&ndbno=" + this.props.id +
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
    this.fetchFocus();
  }


  processListHelper = (stringArray, string, componentArray) => {
    let newArray;
    while(array.includes(string[0]){
      let pos1 = array.indexOf(" " + string[0]);
      let pos2 = array.indexOf(string[1] + ", ");
      let subIngredients = array.substring(pos1 + 2, pos2);
      let group = array.substring(0, pos1);
      let pieces = group.split(", ");
      for (let i = 0; i < pieces.length; i++) {
        if (i < pieces.length - 1) {
          componentArray.push((<li key = {pieces[i]}>{pieces[i].trim()}</li>));
        } else {
          let subSection = [];
          let subPieces = subIngredients.split(", ");
          for (let i = 0; i < subPieces.length; i++) {
            subSection.push((<li key = {subPieces[i]}>{subPieces[i].trim()}</li>)
            );
          }
          componentArray.push((<li key = {pieces[i]}>
            {pieces[i]} <ul>{subSection}</ul></li>)
          );
        }
      }
      array = array.substr(pos2 + 3);
    }

  }

  processIngredients = (ingredients) => {
    let innerSection = [];
    while (ingredients.includes(", ")){
      while(ingredients.includes("(")){
        let pos1 = ingredients.indexOf(" (");
        let pos2 = ingredients.indexOf("), ");
        let subIngredients = ingredients.substring(pos1 + 2, pos2);
        let group = ingredients.substring(0, pos1);
        let pieces = group.split(", ");
        for (let i = 0; i < pieces.length; i++) {
          if (i < pieces.length - 1) {
            innerSection.push((<li key = {pieces[i]}>{pieces[i].trim()}</li>));
          } else {
            let subSection = [];

            // Recursion begins
            while (subIngredients.includes("[")) {
              let pos1 = subIngredients.indexOf(" [");
              let pos2 = subingredients.indexOf("], ");
              let subIngredients2 = subIngredients.substring(pos1 + 2, pos2);
              let group2 = subIngredients.substring(0, pos1);
              let pieces = group2.split(", ");
              for (let i = 0; i <pieces2.length; i++) {
                if (i < pieces.length -1) {
                  subSection.push((<li key = {pieces2[i]}>{pieces2[i].trim()}</li>));
                } else {
                  let subSubSection = [];
                  let subPieces2 = subIngredients2.split(", ")
                  for (let i = 0; i < subPieces2.length; i++){
                    subSubSection.push((<li key={subPieces2[i]}>{subPieces2[i].trim()}</li>));
                  }
                  subSection.push((<li key = {pieces2[i]}>
                    {pieces2[i]} <ul>{subSubSection}</ul></li>)
                  );
                }
              }
              subIngredients = subIngredients.substr(pos2 + 3);
            }
            //recursion ends

            let subPieces = subIngredients.split(", ");
            for (let i = 0; i < subPieces.length; i++) {
              subSection.push((<li key = {subPieces[i]}>{subPieces[i].trim()}</li>)
              );
            }
            innerSection.push((<li key = {pieces[i]}>
              {pieces[i]} <ul>{subSection}</ul></li>)
            );
          }
        }
        ingredients = ingredients.substr(pos2 + 3);
      }

      if (ingredients.includes(", ")) {
        let pieces = ingredients.split(", ");
        for (let i = 0; i < pieces.length; i++) {
          innerSection.push((<li key = {pieces[i]}>{pieces[i].replace(".", " ").trim()}</li>));
        }
        ingredients = "";
      } else if (ingredients.length !== 0) {
        innerSection.push((<li key = {ingredients}>{ingredients.replace(".", " ").trim()}</li>));
        ingredients = "";
      }
    }

    return innerSection;
  }


  processFood = () => {
    let name = this.state.name.trim();
    let food = this.state.focus.info.foods[0].food;
    console.log(food);

    let ingredients = food.ing.desc;
    let ingredientSection = this.processIngredients(ingredients);

    let nutrients;



    let section;
    section = (
      <section>
        {name}
        <div className = "info">
          <div className = "ingredients">
            Ingredients
            <ul className = "scrollable">
              {ingredientSection}
            </ul>
          </div>

          <div className = "nutrients">

          </div>
        </div>
      </section>
    );
    return section;

  }

  render() {
    let section;
    const buildFocus = () => {
      let section;
      let {error, isLoaded} = this.state.focus;

      if (error) {
          section = ("Sorry there was a problem connecting to the web!");
        } else if (!isLoaded) {
          section = ("Loading, please wait...");
        } else {
          section = this.processFood();
        }
        return section;
    }

    section = buildFocus();

    return(
      <div className = "focus">
        {section}
      </div>
    );
  }


}

export default FoodFocus;
