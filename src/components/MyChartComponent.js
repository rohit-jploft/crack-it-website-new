import React, { useEffect } from "react";
import Chart from "react-apexcharts";

const ChartComponent = ({ data }) => {
  const colors = [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560",
    "#775DD0",
    "#00D9E9",
    "#FF66C3",
    "#6A0572",
  ];

  const chartoption = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
        tools: {
          download: false, // <== line to add
        },
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories:
        data?.length > 0 && data.map((item) => `${item?.month}-${item?.year}`),
    },

    fill: {
      opacity: 1,
      colors: ["#01D866"],
    },
  };

  const chartseries = [
    {
      name: "Your Result",
      data: data?.length > 0 && data?.map((item) => item?.count),
    },
  ];
  return (
    <>
      {data.length > 0 && (
        <Chart
          options={chartoption}
          series={chartseries}
          type="bar"
          width="100%"
        />
      )}
    </>
  );
};

export default ChartComponent;
