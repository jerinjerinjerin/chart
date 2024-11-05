import React, { useState } from "react";
import Plot from "react-plotly.js";

const Example2 = () => {
  const countries = [
    {
      color: "#FF5722",
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
  const reviewCounts = getReviewCounts(); // Get review counts
  const xValues = getXValues();
  const xLabels = getTimeLabels();

  const traces = countries.map((country) => ({
    x: xValues,
    y: reviewData.map(rating => rating), // Keep the average rating for y
    mode: "lines+markers+text",
    name: "Average Rating",
    text: xValues.map((value, index) => 
      `${selectedInterval}: ${value}<br>Rating: ${reviewData[index].toFixed(2)} ⭐`
    ),
    textposition: "top center",
    hoverinfo: "text",
    line: {
      color: country.color,
      width: 2,
    },
    marker: {
      size: reviewData.map(rating => (rating > 0 ? rating * 20 : 5)), // Adjust size for visibility
      opacity: 0.7,
      color: country.color,
    },
  }));

 // Review count trace (with no years in the bubble text)
const countTrace = {
  x: xValues,
  y: reviewCounts, // Use review counts for the second trace
  mode: "lines+markers+text", // Add "lines" to show connecting nodes
  name: "Review Count",
  text: reviewCounts.map((count, index) => // Only show the count, no year
    `Count: ${count}`
  ),
  textposition: "top center",
  hoverinfo: "text",
  line: {
    color: "#2196F3", // Line color for the counts
    width: 2, // Line width to ensure visibility
  },
  marker: {
    size: reviewCounts.map(count => (count > 0 ? count * 5 : 5)), // Scale size based on count
    opacity: 0.8,
    color: "#2196F3", // Same color for markers
  },
  yaxis: 'y2', // Use secondary y-axis for review counts
};


  // Combine the reviews traces and the count trace
  const allTraces = [...traces, countTrace];

  return (
    <div className="flex flex-col z-30 justify-center items-center mt-10">
      <Plot
        data={allTraces} // Include the traces in the data
        layout={{
          title: "Reviews Over Time",
          xaxis: {
            title: selectedInterval,
            tickvals: xValues,
            ticktext: xLabels,
            showgrid: false,
            zeroline: true,
            showline: true,
          },
          yaxis: {
            title: "Average Rating",
            tickvals: [1, 2, 3, 4, 5], // Y-axis values for rating
            ticktext: ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'], // Text for each y-axis value with stars
            range: [0, 8], // Set y-axis range according to expected maximum rating
            showgrid: false,
            zeroline: true,
            showline: true,
          },
          yaxis2: {
            title: 'Review Count', // Secondary y-axis for review counts
            overlaying: 'y',
            side: 'right',
            range: [0, Math.max(...reviewCounts) * 1.5], // Adjust range based on review counts
          },
          showlegend: true,
          paper_bgcolor: "white",
          plot_bgcolor: "white",
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "600px" }}
        className="w-full h-full "
      />
      <div className="z-40 bottom-0 fixed">
        <div className="mb-4">
          <label htmlFor="timeInterval" className="mr-2">
            Select Time Interval:
          </label>
          <select
            id="timeInterval"
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
            className="border border-gray-400 p-2 rounded"
          >
            {timeIntervals.map((interval) => (
              <option key={interval} value={interval}>
                {interval}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Example2;
