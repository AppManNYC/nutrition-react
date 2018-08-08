import React from 'react';


const FoodsTotal = (props) => {
  let foodObject = JSON.parse(props.foods);
  console.log(foodObject);




  return(
    <div className = "food-totals">
      <p>
        Disclaimer:

        Metabolic rates vary between individuals, by age, height,
        weight, gender, physical activity, health conditions,
        and many other obscure things (such as weather, season, time of day).
        Please be aware that calculating daily caloric intake
        can be somewhat of an art more so than a science. For a more robust idea
        of your personal needs please consult a qualified health professional.
      </p>
      <p>
        That said, ranges of caloric intake can be prescribed based on the above
        information and intended goals (weight loss/gain/maintenance).
      </p>
      <p>
        For the average female over age 20 (the Center for Disease Control (CDC)
        reports a height of 5 feet 3 inches and weight of 166 pounds). Assuming a
        moderately active lifestyle, prescribed caloric intake for maintenance
        would be near 2250 calories per day (2250 kcals).
      </p>
    </div>
  )
}



export default FoodsTotal;
