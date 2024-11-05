import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import "echarts-gl"; // Importing echarts-gl for 3D charting
import CubeBackground_Texture from '../assets/brick_1.jpg'; // Replace this with your texture image

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
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weeks = [1, 2, 3, 4, 5];
  const days = [1, 2, 3, 4, 5, 6, 7];

  const [selectedInterval, setSelectedInterval] = useState("Years");
  const [selectedData, setSelectedData] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isRightMouseDown, setIsRightMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isRightMouseDown) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        const xRotation = ((clientY / innerHeight) * 2 - 1) * 360;
        const yRotation = ((clientX / innerWidth) * 2 - 1) * -360;

        setRotation({ x: xRotation, y: yRotation });
      }
    };

    const handleMouseDown = (event) => {
      if (event.button === 2) {
        setIsRightMouseDown(true);
      }
    };

    const handleMouseUp = (event) => {
      if (event.button === 2) {
        setIsRightMouseDown(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isRightMouseDown]);

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
            } else {
              reviewsForMonth.push(0); // Default value for missing month reviews
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
            } else {
              reviewsForWeek.push(0); // Default value for missing weeks
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
            } else {
              reviewsForDay.push(0); // Default value for missing days
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

  const handleBubbleClick = (params) => {
    const dataIndex = params.dataIndex;
    const selectedPoint = {
      interval: xValues[dataIndex],
      rating: reviewData[dataIndex].toFixed(2),
      count: reviewCounts[dataIndex],
    };
    setSelectedData(selectedPoint);
  };

  const getMainChartOptions = () => ({
    title: {
      text: "3D Reviews Chart",
      left: "center",
      top: "top",
      textStyle: {
        fontSize: 20,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const dataIndex = params.dataIndex;
        return `${selectedInterval}: ${xValues[dataIndex]}<br>Rating: ${reviewData[dataIndex].toFixed(2)} ⭐<br>Count: ${reviewCounts[dataIndex]}`;
      },
    },
    grid3D: {
      boxWidth: 100,
      boxDepth: 80,
      viewControl: {
        projection: "perspective",
        rotateSensitivity: [1, 1],
        zoomSensitivity: 1.5,
      },
      environment: CubeBackground_Texture, // This applies the background texture
    },
    xAxis3D: {
      type: "category",
      data: xLabels,
      name: selectedInterval,
    },
    yAxis3D: {
      type: "value",
      name: "Count",
    },
    zAxis3D: {
      type: "value",
      name: "Rating",
      min: 0,
      max: 5,
      axisLabel: {
        formatter: "{value} ⭐",
      },
    },
    series: [
      {
        type: "scatter3D",
        data: reviewData.map((rating, index) => [
          xLabels[index],
          reviewCounts[index],
          rating,
        ]),
        symbolSize: (value) => value[2] * 10,
        itemStyle: {
          color: countries[0].color,
        },
        emphasis: {
          itemStyle: {
            color: "#ff3333",
          },
        },
        onClick: handleBubbleClick,
      },
      {
        type: "line3D",
        data: reviewData.map((rating, index) => [
          xLabels[index],
          reviewCounts[index],
          rating,
        ]),
        lineStyle: {
          color: countries[0].color,
          width: 2,
        },
        emphasis: {
          lineStyle: {
            width: 4,
            color: "#ff3333",
          },
        },
      },
    ],
  });

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div>
        <label>Select Time Interval: </label>
        <select
          onChange={(e) => setSelectedInterval(e.target.value)}
          value={selectedInterval}
          className="p-2 border rounded"
        >
          {timeIntervals.map((interval) => (
            <option key={interval} value={interval}>
              {interval}
            </option>
          ))}
        </select>
      </div>

      {/* Main Chart */}
      <div
        className="relative w-full h-[600px] bg-cover"
       
      >
        <ReactECharts option={getMainChartOptions()} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Display selected data */}
      {selectedData && (
        <div className="mt-4 text-center">
          <h3 className="font-bold">Selected Data:</h3>
          <p className="text-gray-700">
            {selectedInterval}: {selectedData.interval}
          </p>
          <p className="text-gray-700">Rating: {selectedData.rating} ⭐</p>
          <p className="text-gray-700">Count: {selectedData.count}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
