import React from 'react';


const MyFoodDisclaimer = () => {




  return(
    <div className = "my-food-disclaimer">
      <p>
        Disclaimer:
        Metabolic rates vary between individuals by age, height,
        weight, gender, physical activity, health conditions,
        and many other obscure things (such as weather, season, time of day).
        Please be aware that calculating daily caloric intake
        can be somewhat of an art. For a more rigorous idea
        of your personal needs please consult a qualified health professional.
      </p>
      <p>
        That said, ranges of caloric intake can be prescribed based on the above
        information and intended goals (weight loss/gain/maintenance).
      </p>
      <p>
        For instance,  the average female over age 20 as reported by the Center
        for Disease Control [CDC] has a height of 5 feet 3 inches and a weight of 166 pounds.
        Assuming a moderately active lifestyle, the prescribed intake for maintenance
        would be about 2250 calories per day (2250 kcals).
      </p>
    </div>
  )
}



export default MyFoodDisclaimer;
