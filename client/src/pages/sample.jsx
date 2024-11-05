import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Flag from "react-world-flags";

const Home = () => {
  const svgRef = useRef(null);

  // Expanded data with 5 more countries
  const countries = [
    {
      name: "South Africa",
      color: "#4CAF50",
      flag: "ZA",
      data: [500.9, 228.7, 417.3, 492.4, 429.4, 384.4, 100],
    },
    {
      name: "Egypt",
      color: "#FF5722",
      flag: "EG",
      data: [104.8, 169.6, 369.1, 350.1, 382.5, 328.8, 442.9],
    },
    {
      name: "Nigeria",
      color: "#2196F3",
      flag: "NG",
      data: [67.8, 107.0, 230.1, 346.7, 333.8, 277.3, 368.7],
    },
    {
      name: "Ethiopia",
      color: "#FFC107",
      flag: "ET",
      data: [8.3, 17.2, 26.9, 55.6, 96.6, 128.3, 256.5],
    },
    {
      name: "Algeria",
      color: "#9C27B0",
      flag: "DZ",
      data: [59.4, 94.1, 177.8, 187.5, 164.8, 251.2, 306.0],
    },
    // Adding 5 more countries
    {
      name: "Kenya",
      color: "#FF9800",
      flag: "KE",
      data: [18.2, 33.9, 46.2, 63.1, 63.4, 93.9, 125.0],
    },
    {
      name: "Morocco",
      color: "#8BC34A",
      flag: "MA",
      data: [42.1, 67.5, 101.0, 116.2, 121.4, 236.0, 287.9],
    },
    {
      name: "Tanzania",
      color: "#FFEB3B",
      flag: "TZ",
      data: [12.4, 23.6, 34.4, 47.4, 49.6, 76.0, 98.6],
    },
    {
      name: "Ghana",
      color: "#03A9F4",
      flag: "GH",
      data: [11.8, 19.4, 31.9, 45.8, 46.9, 62.1, 90.1],
    },
    {
      name: "Ivory Coast",
      color: "#E91E63",
      flag: "CI",
      data: [14.9, 26.3, 45.4, 49.4, 63.1, 128.3, 154.5],
    },
  ];

  const years = [2000, 2005, 2010, 2015, 2020, 2025, 2029];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 50, right: 120, bottom: 50, left: 120 };
    const width = 1200 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // Reversed scale for GDP on the y-axis (from top to bottom)
    const gdpScale = d3.scaleLinear().domain([600, 0]).range([0, height]);

    // Scale for years on the x-axis
    const yearScale = d3
      .scalePoint()
      .domain(years)
      .range([0, width])
      .padding(0.5);

    // Scale for bubble size based on GDP values
    const bubbleScale = d3.scaleSqrt().domain([0, 600]).range([5, 25]);

    // Add GDP axis (right side) without grid lines
    svg
      .append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(gdpScale)); // Removed background grid lines by omitting tickSize

    // Add year axis (bottom side)
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(yearScale));

    // Draw country lines
    countries.forEach((country) => {
      const lineGenerator = d3
        .line()
        .x((d, i) => yearScale(years[i]))
        .y((d) => gdpScale(d)) // Reversed axis logic applied here
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(country.data)
        .attr("fill", "none")
        .attr("stroke", country.color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

      // Add GDP bubbles and labels with scaled size
      country.data.forEach((gdp, i) => {
        svg
          .append("circle")
          .attr("cx", yearScale(years[i]))
          .attr("cy", gdpScale(gdp))
          .attr("r", bubbleScale(gdp)) // Size the bubble based on GDP
          .attr("fill", country.color)
          .attr("opacity", 0.7);

        svg
          .append("text")
          .attr("x", yearScale(years[i]) + 12)
          .attr("y", gdpScale(gdp) + 4)
          .text(`${gdp}B`)
          .attr("font-size", 12)
          .attr("fill", "#000");
      });
    });

    // Add country labels with flags at the start and end
    countries.forEach((country) => {
      // Start of the line
      svg
        .append("text")
        .attr("x", -margin.left + 10)
        .attr("y", gdpScale(country.data[0]))
        .text(country.name)
        .attr("fill", country.color)
        .attr("font-size", 12)
        .attr("text-anchor", "start");

      svg
        .append("image")
        .attr("href", `https://flagcdn.com/w40/${country.flag.toLowerCase()}.png`)
        .attr("x", -margin.left + 80)
        .attr("y", gdpScale(country.data[0]) - 10)
        .attr("width", 20)
        .attr("height", 20);

      // End of the line
      svg
        .append("text")
        .attr("x", width + 10)
        .attr("y", gdpScale(country.data[country.data.length - 1]))
        .text(country.name)
        .attr("fill", country.color)
        .attr("font-size", 12)
        .attr("text-anchor", "start");

      svg
        .append("image")
        .attr("href", `https://flagcdn.com/w40/${country.flag.toLowerCase()}.png`)
        .attr("x", width + 80)
        .attr("y", gdpScale(country.data[country.data.length - 1]) - 10)
        .attr("width", 20)
        .attr("height", 20);
    });
  }, []);

  return (
    <div className="flex justify-center items-center mt-10">
      <svg ref={svgRef} width={1200} height={700} className="bg-white" />
    </div>
  );
};

export default Home;
