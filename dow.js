// Set Margins
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#dow")
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
y.domain([10000,40000]);

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

function plotChart(fileN,classN){
    d3.csv(fileN, function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.value = +d.value;});

    g.append("path")
        .datum(data)
        .attr("class", classN)
        .attr("d", line);
        var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 6);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
      focus.select("text").text(function() { return d.value; });
      focus.select(".x-hover-line").attr("y2", height - y(d.value));
      focus.select(".y-hover-line").attr("x2", width + width);
    }

    ////////////////

           /* Code below relevant for annotations */
           const annotations = [
            
          {
            note: { label: "WHO declares global health emergency", 
              lineType:"none", 
              orientation: "top",
              "padding": 2, 
              "align": "middle" },
            className: "anomaly",
            type: d3.annotationCalloutCircle,
            subject: { radius: 8 },
            data: { x: "1/30/2020", y: 28859},
            dy: -50
          },


          {
            note: { label: "$2 trillion US stimulus bill signed", 
              lineType:"none", 
              orientation: "bottom",
              "padding": 2, 
              "align": "middle" },
            className: "anomaly",
            type: d3.annotationCalloutCircle,
            subject: { radius: 8 },
            data: { x: "3/27/2020", y: 21637},
            dy: 60
          },

          {
            note: { label: "US reaches 100,000 Covid deaths", 
              lineType:"none", 
              orientation: "top",
              "padding": 2, 
              "align": "middle" },
            className: "anomaly",
            type: d3.annotationCalloutCircle,
            subject: { radius: 8 },
            data: { x: "5/27/2020", y: 25548},
            dy: -50
          }
          
        ]

        //An example of taking the XYThreshold and merging it 
          //with custom settings so you don't have to 
          //repeat yourself in the annotations Objects
          const type = d3.annotationCustomType(
            d3.annotationXYThreshold, 
            {"note":{
                "lineType":"none",
                "orientation": "left",
                "align":"middle"}
            }
          )

          const makeAnnotations = d3.annotation()
            .type(type)
            //Gives you access to any data objects in the annotations array
            .accessors({ 
              x: function(d){ return x(new Date(d.x))},
              y: function(d){ return y(d.y) }
            })
            .annotations(annotations)

          //d3.select("svg")
            g.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations)


    });
}

//////////////

function plotChartBack(fileN,classN)
{
    d3.csv(fileN, function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.value = +d.value;});

    g.append("path")
        .datum(data)
        .attr("class", classN)
        .attr("d", line);
        var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");
    });
}


plotChart("https://aravindsp.github.io/cs498datavis/dow/2020.csv","line");

d3.select("#Checkbox2019").on("change",update2019);
d3.select("#Checkbox2018").on("change",update2018);
d3.select("#Checkbox2017").on("change",update2017);

function update2019(){
if(d3.select("#Checkbox2019").property("checked"))
    {
        plotChartBack("https://aravindsp.github.io/cs498datavis/dow/2019.csv","line2019");
    }
        else {
        d3.select("path.line2019").remove();
            }		
    }

function update2018(){
if(d3.select("#Checkbox2018").property("checked"))
    {
        plotChartBack("https://aravindsp.github.io/cs498datavis/dow/2018.csv","line2018");
    }
        else {
        d3.select("path.line2018").remove();
            }		
    }

function update2017(){
        if(d3.select("#Checkbox2017").property("checked"))
            {
                plotChartBack("https://aravindsp.github.io/cs498datavis/dow/2017.csv","line2017");
            }
                else {
                d3.select("path.line2017").remove();
                    }		
            }