import React from 'react';


const ProgressBar = (props) => {

  let numberLine;

  if (props.target) {

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

        <p className = "scale-origin">
          0
        </p>

        <p className = "scale-end">
         4500 kcals
        </p>
      </div>
    );
  } else {

    let scaleEnd = Math.round(props.upperBound * 1.50);



    let width = Math.round(props.currentGrams/scaleEnd*100) + "%";
    console.log(scaleEnd);
    console.log(props.currentGrams);

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

        <p className = "scale-origin">
          0
        </p>

        <p className = "scale-end">
         {scaleEnd} grams
        </p>
      </div>);
  }






  return (
    numberLine
  )

}


export default ProgressBar;
