const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#main-bar-chart")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

let time = 0;
let rawData;
let filteredData;
let interval;
let annotations;
let makeAnnotations;

annotations = [
  {
    note: {
      label:
        "In 2004, Java was the most popular language with PHP the next most popular",
      title: "",
    },
    color: ["#cc0000"],
    x: 550,
    y: 10,
    dy: 30,
    dx: 50,
  },
];

makeAnnotations = d3.annotation().annotations(annotations);

svg.append("g").call(makeAnnotations);

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 80)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Programming Language");

// Y label
const yLabel = g
  .append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -70)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Popularity (%)");

const timeLabel = g
  .append("text")
  .attr("y", HEIGHT + 90)
  .attr("x", WIDTH - 40)
  .attr("font-size", "20px")
  .attr("opacity", "0.7")
  .attr("text-anchor", "middle")
  .text("Year: 2004");

const x = d3.scaleBand().range([0, WIDTH]).paddingInner(0.3).paddingOuter(0.2);

const y = d3.scaleLinear().range([HEIGHT, 0]);

const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);

const yAxisGroup = g.append("g").attr("class", "y axis");

d3.csv("data/programming_languages_processed.csv").then((data) => {
  data.forEach((d) => {
    d.value = Number(d.value);
  });

  filteredData = data;
  rawData = data;
  filteredData = data.filter((d) => {
    return d.year == time + 2004;
  });

  x.domain(filteredData.map((d) => d.variable));
  y.domain([0, d3.max(filteredData, (d) => d.value)]);

  const xAxisCall = d3.axisBottom(x);
  xAxisGroup
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "15")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  const yAxisCall = d3.axisLeft(y).tickFormat((d) => d + "%");
  yAxisGroup.call(yAxisCall);

  const rects = g.selectAll("rect").data(filteredData);

  rects.exit().remove();

  rects
    .attr("y", (d) => y(d.value))
    .attr("x", (d) => x(d.variable))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d.value));

  // ENTER new elements present in new data.
  rects
    .enter()
    .append("rect")
    .attr("y", (d) => y(d.value))
    .attr("x", (d) => x(d.variable))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d.value))
    .attr("fill", "blue");

  //update(data, time);
});

function step() {
  // at the end of our data, loop back
  time = time < 18 ? time + 1 : 0;
  update(rawData, time);
}

function changeButton(status) {
  buttonText = d3.select("#play-button").text();
  if (buttonText === "Play") {
    d3.select("#play-button").text("Pause");
    interval = setInterval(step, 3000);
  } else if (status === "reset") {
    time = 0;
    update(rawData, time);
  } else {
    d3.select("#play-button").text("Play");
    clearInterval(interval);
  }
}

function update(raw_data, year) {
  const t = d3.transition().duration(100);
  d3.select(".annotations").remove();

  filteredData = raw_data.filter((d) => {
    return d.year == year + 2004;
  });
  x.domain(filteredData.map((d) => d.variable));
  y.domain([0, d3.max(filteredData, (d) => d.value)]);

  xAxisCall = d3.axisBottom(x);
  xAxisGroup
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "15")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  yAxisCall = d3.axisLeft(y).tickFormat((d) => d + "%");
  yAxisGroup.call(yAxisCall);

  const rects = g.selectAll("rect").data(filteredData);

  rects.exit().remove();

  if (time === 0) {
    annotations = [
      {
        note: {
          label:
            "In 2004, Java was the most popular language with PHP the next most popular",
          title: "",
        },
        color: ["#cc0000"],
        x: 550,
        y: 10,
        dy: 30,
        dx: 50,
      },
    ];

    makeAnnotations = d3.annotation().annotations(annotations);

    svg.append("g").call(makeAnnotations);
  } else if (time === 10) {
    annotations = [
      {
        note: {
          label:
            "In 2014, Python emerges beyond 10% popularity and we'll continue to see its popularity rise over the subsequent years",
          title: "",
        },
        color: ["#cc0000"],
        x: 875,
        y: 70,
        dy: 30,
        dx: 50,
      },
    ];

    makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);
  } else if (time === 14) {
    annotations = [
      {
        note: {
          label:
            "In 2018, Python moves past Java as the most popular programming language",
          title: "",
        },
        color: ["#cc0000"],
        x: 875,
        y: 130,
        dy: -50,
        dx: 50,
      },
    ];

    makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);
  } else if (time === 18) {
    annotations = [
      {
        note: {
          label:
            "In the current year, 2022, Python has continued to widen its lead as the most popular programming language",
          title: "",
        },
        color: ["#cc0000"],
        x: 875,
        y: 130,
        dy: 30,
        dx: 50,
      },
    ];

    makeAnnotations = d3.annotation().annotations(annotations);
    svg.append("g").call(makeAnnotations);
  }

  rects
    .attr("y", (d) => y(d.value))
    .attr("x", (d) => x(d.variable))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d.value));

  // ENTER new elements present in new data.
  rects
    .enter()
    .append("rect")
    .attr("fill", (d) => "blue")
    .merge(rects)
    .transition(t)
    .attr("y", (d) => y(d.value))
    .attr("x", (d) => x(d.variable));

  timeLabel.text("Year: " + String(time + 2004));
}
