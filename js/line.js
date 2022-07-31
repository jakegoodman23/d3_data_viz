const LINE_MARGIN = { LEFT: 100, RIGHT: 30, TOP: 10, BOTTOM: 100 };
const LINE_WIDTH = 1200 - LINE_MARGIN.LEFT - LINE_MARGIN.RIGHT;
const LINE_HEIGHT = 400 - LINE_MARGIN.TOP - LINE_MARGIN.BOTTOM;

let lineRawData;
let lineFilteredData;
const line_svg = d3
  .select("#line-chart")
  .append("svg")
  .attr("width", LINE_WIDTH + LINE_MARGIN.LEFT + LINE_MARGIN.RIGHT)
  .attr("height", LINE_HEIGHT + LINE_MARGIN.TOP + LINE_MARGIN.BOTTOM);

const line_g = line_svg
  .append("g")
  .attr("transform", `translate(${LINE_MARGIN.LEFT}, ${LINE_MARGIN.TOP})`);

// time parser for x-scale
const parseTime = d3.timeParse("%Y");
// for tooltip
const bisectDate = d3.bisector((d) => d.year).left;
const line_x = d3.scaleTime().range([0, LINE_WIDTH]);
const line_y = d3.scaleLinear().range([LINE_HEIGHT, 0]);

// axis generators
const line_xAxisCall = d3.axisBottom();
const line_yAxisCall = d3
  .axisLeft()
  .ticks(6)
  .tickFormat((d) => d + "%");

// axis groups
const line_xAxis = line_g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${LINE_HEIGHT})`);
const line_yAxis = line_g.append("g").attr("class", "y axis");
// y-axis label
line_yAxis
  .append("text")
  .attr("class", "axis-title")
  .attr("transform", "rotate(-90)")
  .attr("y", -70)
  .attr("x", -(LINE_HEIGHT / 4))
  .attr("font-size", "20px")
  .style("text-anchor", "end")
  .attr("fill", "black")
  .text("Popularity (%)");

// line path generator
const line = d3
  .line()
  .x((d) => line_x(d.year))
  .y((d) => line_y(d.value));

d3.csv("data/programming_languages_processed.csv").then((line_data) => {
  // clean data
  line_data.forEach((d) => {
    d.year = parseTime(d.year);
    d.value = Number(d.value);
  });
  lineRawData = line_data;
  lineFilteredData = lineRawData.filter((d) => {
    return d.variable === "Python";
  });
  // set scale domains
  line_x.domain(d3.extent(lineFilteredData, (d) => d.year));
  line_y.domain([0, d3.max(lineFilteredData, (d) => d.value) * 1.005]);

  // generate axes once scales have been set
  line_xAxis.call(line_xAxisCall.scale(line_x));
  line_yAxis.call(line_yAxisCall.scale(line_y));

  // add line to chart
  line_g
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    //.attr("stroke-LINE_WIDTH", "1000px")
    .style("stroke-width", "4")
    .attr("d", line(lineFilteredData));
});

d3.select("#lang-select").on("change", function () {
  newLang = d3.select(this).property("value");

  lineFilteredData = lineRawData.filter((d) => {
    return d.variable === newLang;
  });
  line_update(lineFilteredData);
});

function line_update(new_data) {
  console.log(new_data);
  //line_g.selectAll(".line").remove();
  const t = d3.transition().duration(1000);
  // set scale domains
  line_x.domain(d3.extent(new_data, (d) => d.year));
  line_y.domain([0, d3.max(new_data, (d) => d.value) * 1.005]);

  // generate axes once scales have been set
  line_xAxis.transition(t).call(line_xAxisCall.scale(line_x));
  line_yAxis.transition(t).call(line_yAxisCall.scale(line_y));

  const lines = line_g.selectAll(".line").data(new_data);
  lines.exit().remove();

  // add line to chart
  line_g
    .enter()
    .append("path")
    .attr("class", "line")
    .merge(lines)
    .attr("fill", "none")
    .transition(t)
    .attr("stroke", "grey")
    //.attr("stroke-LINE_WIDTH", "1000px")
    .style("stroke-width", "4")
    .attr("d", line(new_data));
}
