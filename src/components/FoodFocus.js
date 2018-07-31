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


  componentDidMount = () => {
    let url = "https://api.nal.usda.gov/ndb/V2/reports?" +
      "format=" + "json" +
      "&ndbno=" + this.props.id +
      "&type=" + "f" +
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

  processFood = () => {
    let section;
    console.log(this.state.focus.info);
    let name = this.state.name;
    let food = this.state.focus.info.foods[0].food;
    let ingredients = food.ing.desc



    section = (<div className = "nutrients">
      </div>)



  }

  render() {
    let section;
    const buildFocus = () => {
      let section;
      let {error, isLoaded, info} = this.state.focus;

      if (error) {
          section = ("Sorry there was a problem connecting to the web!");
        } else if (!isLoaded) {
          section = ("Loading, please wait...");
        } else {
          console.log(info);
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
