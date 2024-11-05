import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

const Home = () => {
  const countries = [
    {
      color: "#3333cc",
      reviews: {
        2015: [1.5, 1, 1, 4, 2, 2, 3.5, 3, 5, 4],
        2016: [2.5, 4, 5, 5, 4, 4.5, 4.2, 2],
        2017: [3.0, 4.5, 5, 5.0, 4.5, 4.8, 4.7, 1],
        2018: [3.5, 4.8, 5, 5.5, 5.0, 5, 5],
        2019: [4.0, 5.0, 5, 5.8, 5.5, 5, 5, 4],
        2020: [1, 2, 3, 4, 5, 4, 4.8, 4.9, 4],
        2021: [1, 1, 1, 1, 1, 1, 1, 1, 1],
        2022: [1, 2, 3, 4, 5, 4, 4, 4, 4, 5, 3, 4, 3, 4],
        2023: [1, 2, 3, 4, 5, 4, 4.8, 4.9, 4, 4, 1],
        2024: [5, 5, 5, 5, 5, 5, 5, 4.9, 5],
      },
    },
  ];

  const timeIntervals = ["Years", "Months", "Weeks", "Days"];
  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const weeks = [1, 2, 3, 4, 5];
  const days = [1, 2, 3, 4, 5, 6, 7];

  const [selectedInterval, setSelectedInterval] = useState("Years");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      // Calculate rotation values based on mouse position
      const xRotation = ((clientY / innerHeight) * 2 - 1) * 45; // 45-degree max rotation
      const yRotation = ((clientX / innerWidth) * 2 - 1) * -45; // 45-degree max rotation

      setRotation({ x: xRotation, y: yRotation });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getXValues = () => {
    switch (selectedInterval) {
      case "Years":
        return years;
      case "Months":
        return months;
      case "Weeks":
        return weeks;
      case "Days":
        return days;
      default:
        return years;
    }
  };

  const getTimeLabels = () => {
    switch (selectedInterval) {
      case "Years":
        return years.map((year) => `${year}`);
      case "Months":
        return months.map((month) => month);
      case "Weeks":
        return weeks.map((week) => `Week ${week}`);
      case "Days":
        return days.map((day) => `Day ${day}`);
      default:
        return years.map((year) => `${year}`);
    }
  };

  const getReviewData = () => {
    switch (selectedInterval) {
      case "Years":
        return years.map((year) => {
          const reviewsForYear = countries[0].reviews[year] || [];
          return reviewsForYear.length > 0
            ? reviewsForYear.reduce((sum, val) => sum + val, 0) / reviewsForYear.length
            : 0;
        });
      case "Months":
        return months.map((_, index) => {
          const reviewsForMonth = [];
          for (let year of years) {
            if (countries[0].reviews[year][index]) {
              reviewsForMonth.push(countries[0].reviews[year][index]);
            }
          }
          return reviewsForMonth.length > 0
            ? reviewsForMonth.reduce((sum, val) => sum + val, 0) / reviewsForMonth.length
            : 0;
        });
      case "Weeks":
        return weeks.map((week) => {
          const reviewsForWeek = [];
          for (let year of years) {
            const reviews = countries[0].reviews[year] || [];
            if (reviews.length > week - 1) {
              reviewsForWeek.push(reviews[week - 1]);
            }
          }
          return reviewsForWeek.length > 0
            ? reviewsForWeek.reduce((sum, val) => sum + val, 0) / reviewsForWeek.length
            : 0;
        });
      case "Days":
        return days.map((day) => {
          const reviewsForDay = [];
          for (let year of years) {
            const reviews = countries[0].reviews[year] || [];
            if (reviews.length > day - 1) {
              reviewsForDay.push(reviews[day - 1]);
            }
          }
          return reviewsForDay.length > 0
            ? reviewsForDay.reduce((sum, val) => sum + val, 0) / reviewsForDay.length
            : 0;
        });
      default:
        return [];
    }
  };

  const getReviewCounts = () => {
    switch (selectedInterval) {
      case "Years":
        return years.map((year) => countries[0].reviews[year]?.length || 0);
      case "Months":
        return months.map((_, index) => {
          let count = 0;
          for (let year of years) {
            if (countries[0].reviews[year][index]) {
              count++;
            }
          }
          return count;
        });
      case "Weeks":
        return weeks.map((week) => {
          let count = 0;
          for (let year of years) {
            const reviews = countries[0].reviews[year] || [];
            if (reviews.length > week - 1) {
              count++;
            }
          }
          return count;
        });
      case "Days":
        return days.map((day) => {
          let count = 0;
          for (let year of years) {
            const reviews = countries[0].reviews[year] || [];
            if (reviews.length > day - 1) {
              count++;
            }
          }
          return count;
        });
      default:
        return [];
    }
  };

  const reviewData = getReviewData();
  const reviewCounts = getReviewCounts();
  const xValues = getXValues();
  const xLabels = getTimeLabels();

  const getMainChartOptions = () => ({
    title: {
      text: "Reviews Over Time",
    },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const dataIndex = params[0].dataIndex;
        return `${selectedInterval}: ${xValues[dataIndex]}<br>Rating: ${reviewData[dataIndex].toFixed(2)} ⭐<br>Count: ${reviewCounts[dataIndex]}`;
      },
    },
    xAxis: {
      type: "category",
      data: xLabels,
      name: selectedInterval,
      axisLabel: {
        rotate: 45, // Rotate x-axis labels for better visibility
      },
    },
    yAxis: {
      type: "value",
      name: "Rating",
      min: 0,
      max: 8,
      axisLabel: {
        formatter: "{value} ⭐",
      },
    },
    series: [
      {
        data: reviewData,
        type: "line",
        smooth: true,
        name: "Reviews",
        symbolSize: (value) => (value > 0 ? value * 4 : 5),
        lineStyle: {
          color: countries[0].color,
          width: 2,
        },
        itemStyle: {
          color: countries[0].color,
        },
      },
    ],
  });

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      {/* Red Box */}
      <div
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, // Apply rotation to the red box
          transition: 'transform 0.2s', // Smooth transition for rotation
        }}
      >
        <p style={{ color: "#fff" }}>Control Box</p>
      </div>

      {/* Main Chart */}
      <div
        style={{
          width: "100%",
          height: "600px",
          marginTop: "20px", // Space between the red box and chart
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, // Apply rotation to the chart
          transition: 'transform 0.2s', // Smooth transition for chart rotation
        }}
      >
        <ReactECharts option={getMainChartOptions()} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default Home;
