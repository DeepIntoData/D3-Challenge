var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) *0.95,
      d3.max(Data, d => d[chosenXAxis]) 
    ])
    .range([0, width]);

  return xLinearScale;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(Data, err) {
  if (err) throw err;
  console.log(Data);

  // parse data
  Data.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(Data, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([8, d3.max(Data, d => d.smokes)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("text")
    .attr("y", 435)
    .attr("x", 450)
    .attr("dy", "1em")
    .classed("active", true)
    .text("Age");

    // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Smokers");

  // append initial circles
  chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 15)
    .attr("fill", "skyblue")
    .attr("opacity", ".5");

    //append text to circles
    chartGroup.append("g")
    .selectAll('text')
    .data(Data)
    .enter()
    .append("text")
    .text(d=>d.abbr)
    .attr("x",d=>xLinearScale(d.age))
    .attr("y",d=>yLinearScale(d.smokes))
    .classed(".stateText", true)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "10px")
    .style("font-weight", "bold")
    .attr("alignment-baseline", "central");
    
}).catch(function(error) {
  console.log(error);
});
