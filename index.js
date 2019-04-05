function init() {
  var w = document.getElementById("main").getBoundingClientRect().width;
  // Triangle svg
  var svg_triangle = d3.select("#svg-triangle");
  var w_triangle = w;
  var h_triangle = w*Math.sqrt(3)/2;
  svg_triangle.style("width", w);
  svg_triangle.style("height", h_triangle);

  // Scales
  var rScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, function(d) { return d.total_litres_of_pure_alcohol; })])
                 .range([0, 15]);
  var corners = [[w_triangle/2, h_triangle/6+5],[w_triangle/6+5, 5/6*h_triangle-5],[w_triangle*5/6-10, 5/6*h_triangle-5]];

  // Colors
  var orange = d3.color("#767A00");

  // Functions
  function coord(arr) { // function that finds x y pos in triangle
		var a = arr[0], b=arr[1], c=arr[2];
		var sum, pos = [0,0];
	    sum = a + b + c;
	    if(sum !== 0) {
		    a /= sum;
		    b /= sum;
		    c /= sum;
			pos[0] =  corners[0][0]  * a + corners[1][0]  * b + corners[2][0]  * c;
			pos[1] =  corners[0][1]  * a + corners[1][1]  * b + corners[2][1]  * c;
		}
	  return pos;
	}; // end coord
  d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
  }; // end moveToFront function
  function setup() {
    // Draw triangle
    svg_triangle.append("g")
                .attr("class", "triangle")
                .attr("transform", "translate("+ w_triangle/2 + ", " + h_triangle/2 + ")")
                .append("path")
                .attr("d", "M 0 " + (-h_triangle/3) + " L " + (-w_triangle/3) + " " + (h_triangle/3) + "L " + (w_triangle/3) + " " + (h_triangle/3) + " Z");
    // Draw labels
    svg_triangle.selectAll("axisLabels")
                .data(["Beer", "Wine", "Spirits"])
                .enter()
                .append("text")
                .text(function(d) { return d; })
                .attr("class", "axisLabels")
                .attr("x", function(d,i) {
                  if (i==0) { return w/2; }
                  else if (i==1) { return w_triangle/2 - w_triangle/3 - 15; }
                  else { return w_triangle/2 + w_triangle/3 + 15; }
                })
                .attr("y", function(d,i) {
                  if (i==0) { return h_triangle/2 - h_triangle/3 - 15; }
                  else { return h_triangle/2 + h_triangle/3; }
                })
                .style("text-anchor", function(d,i) {
                  if (i==0) { return "middle"; }
                  else if (i==1) { return "end"; }
                  else { return "start"; }
                });
    // Draw circles
    svg_triangle.selectAll("countryCircles")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("class", "countryCircles")
                .attr("r", function(d) { return rScale(d.total_litres_of_pure_alcohol); })
                .attr("cx", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[0]; })
                .attr("cy", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[1]; })
                .on("mouseover", function(d) {
                  var currCircle = d3.select(this);
                  var currCountry = d.country;
                  var currRadius = parseFloat(d3.select(this).attr("r"));
                  var tooltipWidth = d3.max([80, currCountry.length*10], function(d) { return d; });
                  var tooltipHeight = 95;
                  var currLabelGroup = svg_triangle.append("g")
                                                   .attr("class", "labelGroup")
                                                   .attr("transform", "translate("+ (currCircle.attr("cx")-(tooltipWidth+20)/2) + "," + (currCircle.attr("cy") - (tooltipHeight+currRadius+5)) + ")");
                  currLabelGroup.append("rect")
                                .attr("class", "labelRect")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("width", tooltipWidth + 20)
                                .attr("height", tooltipHeight)
                  currLabelGroup.append("text")
                                .attr("class", "dataLabels")
                                .attr("id", "countryName")
                                .text(currCountry)
                                .attr("x", function(d) { return (tooltipWidth+20)/2; })
                                .attr("y", function(d) { return 20; });
                  currLabelGroup.append("text")
                                .attr("class", "dataLabels")
                                .attr("id", "beerLabel")
                                .text("Beer: " + d.beer_servings)
                                .attr("x", function(d) { return (tooltipWidth+20)/2; })
                                .attr("y", function(d) { return 40; })
                  currLabelGroup.append("text")
                                .attr("class", "dataLabels")
                                .attr("id", "wineLabel")
                                .text("Wine: " + d.wine_servings)
                                .attr("x", function(d) { return (tooltipWidth+20)/2; })
                                .attr("y", function(d) { return 60; })
                  currLabelGroup.append("text")
                                .attr("class", "dataLabels")
                                .attr("id", "spiritLabel")
                                .text("Spirits: " + d.spirit_servings)
                                .attr("x", function(d) { return (tooltipWidth+20)/2; })
                                .attr("y", function(d) { return 80; })
                  currCircle.classed("countryCircles-active", true);
                })
              .on("mouseout", function() {
                d3.select(".labelGroup").remove().exit();
                d3.select(this).classed("countryCircles-active", false);
              })
  }; // end setup

  setup();
}; // end init

function rowConverter(d) {
  return {
    country: d.country,
    beer_servings: parseInt(d.beer_servings),
    spirit_servings: parseInt(d.spirit_servings),
    wine_servings: parseInt(d.wine_servings),
    total_litres_of_pure_alcohol: parseInt(d.total_litres_of_pure_alcohol),
    beer_litres: parseFloat(d.beer_litres),
    spirit_litres: parseFloat(d.spirit_litres),
    wine_litres: parseFloat(d.wine_litres),
    other_litres: parseFloat(d.other_litres),
    beer_share: parseFloat(d.beer_share) || 0,
    spirit_share: parseFloat(d.spirit_share) || 0,
    wine_share: parseFloat(d.wine_share) || 0,
    other_share: parseFloat(d.other_share) || 0
  }
} // end rowConverter
d3.csv("data/data_edited.csv", rowConverter, function(data) {
  dataset = data;
  init();
})
