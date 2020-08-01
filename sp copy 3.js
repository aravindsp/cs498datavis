// Set Margins
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#sp")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+50)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Set Start ad End Dates for Axis
var startDate = new Date("2020-01-01"),
    endDate = new Date("2020-07-31");

//Plot Axis
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

x.domain([startDate,endDate]);
y.domain([1000,40000]);

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


g.append("g")
.attr("class", "axis axis--x")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b")));

g.append("g")
.attr("class", "axis axis--y")
.call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { return parseInt(d); }))
.append("text")
.attr("class", "axis-title")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", ".71em")
.style("text-anchor", "end")
.text("Index Value");

///////////////////////////////////////////////////////////

var line = d3.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.value); });

var parseTime = d3.timeParse("%Y%m%d")
bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Read File


d3.csv("https://aravindsp.github.io/cs498datavis/dow.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.value = +d.value;});

g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);
});

d3.select("#myCheckbox").on("change",update);

function update(){
d3.csv("https://aravindsp.github.io/cs498datavis/sp.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
    d.date = parseTime(d.date);
    d.value = +d.value;});
    if(d3.select("#myCheckbox").property("checked"))
    {
        g.append("path")
            .datum(data)
            .attr("class", "line2019")
            .attr("d", line);
    }
    else {
    d3.select("path.line2019").remove();}		
});
}