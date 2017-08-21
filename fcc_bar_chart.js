function draw(data) {

	// format data
	data = data.data;
	var parseTime = d3.timeParse("%Y-%m-%d");
	var formatTime = d3.timeFormat("%B %Y");
	var formatCurrency = d3.format("$,.0f");

	data.forEach(function(d) {
		d[0] = parseTime(d[0]);
	});
	
	// basic variables
	"use strict";
	var margin = 75,
		width = 1400 - margin,
		height = 600 - margin,
		radius = 5,
		color = 'steelblue';

	// chart title
	d3.select("body")
		.append("h2")
		.text("US Gross Domestic Product");

	d3.select("body")
		.append("p")
		.text("Source: Federal Reserve Economic Data");

	// set up svg chart element
	var svg = d3.select("body")
		.append("svg")
			.attr("width", width + margin)
			.attr("height", height + margin)
		.append("g")
			.attr("class", "chart");

	d3.select("svg")
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect");

	// find range of date column
	var time_extent = d3.extent(data, function(d) {
		return d[0];
	})

	// find range of value column
	var value_extent = d3.extent(data, function(d) {
		return d[1];
	})

	// create x-axis scale mapping dates -> pixels
	var time_scale = d3.scaleTime()
		.range([margin, width])
		.domain(time_extent);

	// create y-axis scale mapping value -> pixels
	var value_scale = d3.scaleLinear()
		.range([height, margin])
		.domain(value_extent);

	// create x axis for time
	var time_axis = d3.axisBottom()
		.scale(time_scale);

	// create y axis for value
	var value_axis = d3.axisLeft()
		.scale(value_scale);

	// draw x axis
	d3.select("svg")
		.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(time_axis);

	// draw y axis
	d3.select("svg")
		.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin + ",0)")
		.call(value_axis);

	// add tooltips
	var tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style("top", "150px")
		.style("left", (margin + 50) + "px")
		.style("font-size", "15px")
		.text("sample tooltip");

	// draw data bars
	d3.selectAll("rect")
		.attr("class", "bar")
		.attr("x", function(d) {
			return time_scale(d[0]);
		})
		.attr("y", function(d) {
			return value_scale(d[1]);
		})
		.attr("width", "3px")
		.attr("height", function(d) {
			return height - value_scale(d[1]);
		})
		.on("mouseover", function(d) {
			tooltip.style("visibility", "visible");
			tooltip.text(formatTime(d[0]) + " - " + formatCurrency(d[1]) + " billion");
		})
		.on("mouseout", function() {
			tooltip.style("visibility", "hidden");
		});

	// Description added

	d3.select("body")
		.append('p')
		.attr("class", "description")
		.html("Units: Billions of U.S. Dollars | Seasonally Adjusted Annual Rate<br>Notes: <a href='http://www.bea.gov/national/pdf/nipaguid.pdf' target='_blank'>A Guide to the National Income and Product Accounts of the United States (NIPA)</a>");

}

d3.json("gdp_data.json", draw);