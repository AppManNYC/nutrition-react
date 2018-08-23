import React, { Component } from 'react';


class foodLimit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goal: {gain: false, maintain: true, lose: false},
      default: true,
      data: {gender: "female",
             weight: 75.3,
             height: 1.6,
             activity: "moderate"
            },
      currentTotals: []
    }
  }

changeState = (newProps) => {
  let newPropsString = JSON.stringify(newProps.totals);
  let oldStateString = JSON.stringify(this.state.currentTotals)

  if (newPropsString !== oldStateString) {
    this.setState({
      currentTotals: JSON.parse(newPropsString)
    });
  }

}

  componentDidMount() {
    this.changeState(this.props);
  }


  componentWillReceiveProps(newProps) {
    this.changeState(newProps);
  }
  render() {

    let section;
    if (this.state.default) {
      section = (<p> Based on the default suggestion for the average female (see/change below),
          the suggested target for weight maintenance is 2250 kcals.
      </p>)
    }


    return(

      <div>
        {section}
      </div>



    )
  }



}


export default foodLimit;
