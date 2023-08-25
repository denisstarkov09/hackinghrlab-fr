import React from "react";

import { Chart as ChartJS, ArcElement, Tooltip} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const DoughnutComponent = ({ options, data }) => {
  
  return (
    <>
      <Doughnut data={data} options={options}/>
    </>
  );
};

export default DoughnutComponent;
