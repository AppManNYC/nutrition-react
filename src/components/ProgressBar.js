import React from 'react';


const ProgressBar = (props) => {

  let numberLine;

  if (props.target && props.set) {

    let place = Math.round(props.target/4500*100) + "%";

    let targetStyle = {
      left: place
    };


    let width = Math.round(props.currentKcals/4500*100) + "%";
    let progressStyle = {
      width: width
    };

    numberLine = (
      <div className = "line-container">
        <div className = "numberline">

          <div className = "line" style = {progressStyle}>
          </div>
          <div className = "target" style = {targetStyle}>
            <p> Target </p>
          </div>
        </div>
      </div>
    );
  } else if (props.set) {

    let scaleEnd = Math.round(props.upperBound * 1.50);



    let width = Math.round(props.currentGrams/scaleEnd*100) + "%";


    const progressStyle = {
      width: width
    };

    let place = Math.round(props.lowerBound/scaleEnd*100) + "%";
    const lowerBoundStyle = {
      left: place
    };

    let place2 = Math.round(props.upperBound/scaleEnd*100) + "%";
    const upperBoundStyle = {
      left: place2
    }

    numberLine = (
      <div className = "line-container">
        <div className = "numberline">

          <div className = "line" style = {progressStyle}>
          </div>
          <div className = "threshold-1" style = {lowerBoundStyle}>
            <p> Low </p>
          </div>
          <div className = "threshold-2" style = {upperBoundStyle}>
            <p> High </p>
          </div>
        </div>
      </div>);
  } else {
    numberLine = ( <h3> Working on your settings!  </h3>);
  }






  return (
    numberLine
  )

}


export default ProgressBar;
