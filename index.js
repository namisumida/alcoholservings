function init() {
  var w = document.getElementById("main").getBoundingClientRect().width;
  var w_window = document.body.clientWidth;
  var margin = { left: 10, right: 10, top: 10 };
  document.getElementById("top20-text-container").style.width = w/3 + "px";
  document.getElementById("text-triangle").style.width = w*.3 + "px";
  if (w_window <= 400) {
    w_barLabels = 85;
  }
  else { w_barLabels = 95; }
  // Data
  var dataset20 = dataset.sort(function(a,b) { return b.total_servings-a.total_servings; }).slice(0,20);
  var dataset_beer20 = dataset.sort(function(a,b) { return b.beer_servings-a.beer_servings; }).slice(0,20);
  var dataset_wine20 = dataset.sort(function(a,b) { return b.wine_servings-a.wine_servings; }).slice(0,20);
  var dataset_spirit20 = dataset.sort(function(a,b) { return b.spirit_servings-a.spirit_servings; }).slice(0,20);
  var maxServings = d3.max(dataset, function(d) { return d.total_servings; });
  // Colors
  var green = d3.color("#4FCCC3");
  var pink = d3.color("#FF6B6B");
  var orange = d3.color("#E9C46A");
  ////////////////////////////////////////////////////////////////////////
  ///////////////// top 20 bars /////////////////////////////////////
  var svg_bars = d3.select("#svg-top");
  if (w_window <= 600) { // for single panel view
    w_svgBars = w; // make it full width
    document.getElementById("top20-text-container").style.width = w + "px"; // make it full width
    document.getElementById("section-top20").style.display = "block";
    d3.select("#svg-top").style("margin-left", "0px");
    d3.select("#top20-chartTitle").style("margin-left", "0px").style("margin-bottom", "25px");
    d3.select("#top20-svg-container").style("margin-left", "0px");
  }
  else { // make it double panel view
    document.getElementById("top20-text-container").style.width = w/3 + "px";
    w_svgBars = w*2/3;
    document.getElementById("section-top20").style.display = "flex";
    d3.select("#svg-top").style("margin-left", "20px");
    d3.select("#top20-chartTitle").style("margin-left", "30px").style("margin-bottom", "10px");
    d3.select("#top20-svg-container").style("margin-left", "20px");
  }
  var h_bar = 20;
  var h_barSpacing = 5;
  var h_typeLabels = 10;
  svg_bars.style("width", w_svgBars);
  svg_bars.style("height", (h_bar+h_barSpacing)*20 + margin.top);
  var barScale = d3.scaleLinear()
                   .domain([0, maxServings])
                   .range([0, w_svgBars-w_barLabels-25]); // 10 for spacing between labels and bars and another 15 for margin right
  function setup_bars() {
    // Bars
    svg_bars.selectAll("barGroups")
            .data(dataset20)
            .enter()
            .append("g")
            .attr("class", "barGroups");
    svg_bars.selectAll(".barGroups")
            .append("rect")
            .attr("class", "bars")
            .attr("height", h_bar)
            .attr("width", function(d) { return barScale(d.total_servings); })
            .attr("x", w_barLabels + 10)
            .attr("y", function(d,i) { return margin.top + i*(h_bar+h_barSpacing); });
    svg_bars.selectAll(".barGroups")
            .append("text")
            .attr("class", "barLabels")
            .attr("x", w_barLabels)
            .attr("y", function(d,i) { return margin.top + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .text(function(d) { return d.country; });
    svg_bars.selectAll(".barGroups")
            .append("text")
            .attr("class", "barLabels")
            .attr("id", "literLabels")
            .attr("x", function(d) { return w_barLabels + barScale(d.total_servings); })
            .attr("y", function(d,i) { return margin.top + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .text(function(d,i) {
              if (i==0) { return d.total_servings + " servings"; }
              else { return d.total_servings; }
            })
            .style("fill", "white");
  }; // end setup_bars
  function resize_bars() {
    // Adjust bars
    if (w_window <= 600) { // for single panel view
      w_svgBars = w; // make it full width
      document.getElementById("top20-text-container").style.width = w + "px"; // make it full width
      document.getElementById("section-top20").style.display = "block";
      d3.select("#svg-top").style("margin-left", "0px");
      d3.select("#top20-chartTitle").style("margin-left", "0px").style("margin-bottom", "25px");
      d3.select("#top20-svg-container").style("margin-left", "0px");
    }
    else { // make it double panel view
      document.getElementById("top20-text-container").style.width = w/3 + "px";
      w_svgBars = w*2/3;
      document.getElementById("section-top20").style.display = "flex";
      d3.select("#svg-top").style("margin-left", "20px");
      d3.select("#top20-chartTitle").style("margin-left", "30px").style("margin-bottom", "10px");
      d3.select("#top20-svg-container").style("margin-left", "20px");
    }
    svg_bars.style("width", w_svgBars);
    barScale = d3.scaleLinear()
                 .domain([0, maxServings])
                 .range([0, w_svgBars-w_barLabels-25]);
    svg_bars.selectAll(".barGroups").select(".bars")
            .attr("width", function(d) { return barScale(d.total_servings); })
            .attr("x", w_barLabels + 10)
    svg_bars.selectAll(".barGroups").select(".barLabels")
            .attr("x", w_barLabels);
    svg_bars.selectAll(".barGroups").select("#literLabels")
            .attr("x", function(d) { return w_barLabels + barScale(d.total_servings); });
  }; // end resize bars
  ////////////////////////////////////////////////////////////////////////
  //////////// colored bars /////////////////////////////////////////////
  var svg_colors = d3.select("#svg-colors");
  if (w_window > 600) { w_svgColors = w*.8; }
  else { w_svgColors = w; }
  svg_colors.style("width", w_svgColors);
  svg_colors.style("height", (h_bar+h_barSpacing)*20 + h_typeLabels + margin.top);
  var colorBarScale = d3.scaleLinear()
                        .domain([0, maxServings])
                        .range([0, w_svgColors-w_barLabels-25]);
  function setup_colors() {
    // Set up colored bars
    svg_colors.selectAll("axisLabels")
              .data(["Beer", "Wine", "Spirits"])
              .enter()
              .append("text")
              .attr("class", "typeLabels")
              .attr("x", function(d,i) {
                if (i==0) { return w_barLabels + 10 + colorBarScale(dataset20[0].beer_servings)/2; }
                else if (i==1) { return w_barLabels + 10 + colorBarScale(dataset20[0].beer_servings) + colorBarScale(dataset20[0].wine_servings)/2; }
                else { return w_barLabels + 10 + colorBarScale(dataset20[0].beer_servings) + colorBarScale(dataset20[0].wine_servings) + colorBarScale(dataset20[0].spirit_servings)/2; }
              })
              .attr("y", margin.top)
              .text(function(d) { return d; });
    // Rectangles
    // Bars
    svg_colors.selectAll("barGroups")
              .data(dataset20)
              .enter()
              .append("g")
              .attr("class", "barGroups");
    svg_colors.selectAll(".barGroups")
              .append("text")
              .attr("class", "barLabels")
              .attr("x", w_barLabels)
              .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
              .text(function(d) { return d.country; });
    svg_colors.selectAll(".barGroups")
              .append("rect")
              .attr("class", "beerRect")
              .attr("x", function(d) { return w_barLabels + 10; })
              .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing); })
              .attr("width", function(d) { return colorBarScale(d.beer_servings); })
              .attr("height", h_bar);
    svg_colors.selectAll(".barGroups")
              .append("rect")
              .attr("class", "wineRect")
              .attr("x", function(d) { return w_barLabels + 10 + colorBarScale(d.beer_servings); })
              .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing); })
              .attr("width", function(d) { return colorBarScale(d.wine_servings); })
              .attr("height", h_bar);
    svg_colors.selectAll(".barGroups")
              .append("rect")
              .attr("class", "spiritsRect")
              .attr("x", function(d) { return w_barLabels + 10 + colorBarScale(d.beer_servings) + colorBarScale(d.wine_servings); })
              .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing); })
              .attr("width", function(d) { return colorBarScale(d.spirit_servings); })
              .attr("height", h_bar);
    // Mouseovers
    // Add one that loads on init
    svg_colors.append("text")
              .attr("class", "beerLabels")
              .attr("x", function() { return w_barLabels + colorBarScale(dataset20[0].beer_servings) + 5; })
              .attr("y", function() { return margin.top + h_typeLabels + (h_bar+h_barSpacing)/2 + 2; })
              .text(function(d) { return dataset20[0].beer_servings + " servings"; });
    svg_colors.append("text")
              .attr("class", "wineLabels")
              .attr("x", function() { return w_barLabels + colorBarScale(dataset20[0].beer_servings) + colorBarScale(dataset20[0].wine_servings) + 5; })
              .attr("y", function() { return margin.top + h_typeLabels + (h_bar+h_barSpacing)/2 + 2; })
              .text(function(d) { return dataset20[0].wine_servings; });
    svg_colors.append("text")
              .attr("class", "spiritLabels")
              .attr("x", function() { return w_barLabels + colorBarScale(dataset20[0].beer_servings) + colorBarScale(dataset20[0].wine_servings) + colorBarScale(dataset20[0].spirit_servings) + 5; })
              .attr("y", function() { return margin.top + h_typeLabels + (h_bar+h_barSpacing)/2 + 2; })
              .text(function(d) { return dataset20[0].spirit_servings; });
    // Mouseover labels
    svg_colors.selectAll(".barGroups").on("mouseover", function(d,i) {
      d3.selectAll(".beerLabels").remove();
      d3.selectAll(".wineLabels").remove();
      d3.selectAll(".spiritLabels").remove();
      var currGroup = d3.select(this);
      var currY = parseInt(currGroup.select(".beerRect").attr("y"));
      currGroup.append("text")
               .attr("class", "beerLabels")
               .attr("x", function() { return w_barLabels + colorBarScale(d.beer_servings) + 5; })
               .attr("y", function() { return currY + (h_bar+h_barSpacing)/2 + 2; })
               .text(function(d) { return d.beer_servings; });
      currGroup.append("text")
               .attr("class", "wineLabels")
               .attr("x", function() {
                 if (i==2 | i==5 | i==9) { return w_barLabels + colorBarScale(d.beer_servings) + colorBarScale(d.wine_servings) + 8; }
                 else if (i==11 | i==12 | i==16 | i==19) { return w_barLabels + colorBarScale(d.beer_servings) + colorBarScale(d.wine_servings) - 5; }
                 else { return w_barLabels + colorBarScale(d.beer_servings) + colorBarScale(d.wine_servings) + 5; }
               })
               .attr("y", function() { return currY + (h_bar+h_barSpacing)/2 + 2; })
               .text(function(d) { return d.wine_servings; })
               .style("text-anchor", function(d,i) {
                 if (i==2 | i==5 | i==9) { return "start"; }
                 else { return "end"; }
               });
      currGroup.append("text")
               .attr("class", "spiritLabels")
               .attr("x", function() { return w_barLabels + colorBarScale(d.beer_servings) + colorBarScale(d.wine_servings) + colorBarScale(d.spirit_servings) + 5; })
               .attr("y", function() { return currY + (h_bar+h_barSpacing)/2 + 2; })
               .text(function(d) { return d.spirit_servings; });
    });
  }; // end color_bars
  function resize_colorBars() {
    if (w_window > 600) { w_svgColors = w*.8; }
    else { w_svgColors = w; }
    svg_colors.style("width", w_svgColors);
    colorBarScale = d3.scaleLinear()
                       .domain([0, maxServings])
                       .range([0, w_svgColors-w_barLabels-25]);
    svg_colors.selectAll(".barGroups").select(".barLabels").attr("x", w_barLabels);
    svg_colors.selectAll(".typeLabels")
              .attr("x", function(d,i) {
                if (i==0) { return w_barLabels + 10 + colorBarScale(dataset20[0].beer_servings)/2; }
                else if (i==1) { return w_barLabels + 10 + colorBarScale(dataset20[0].beer_servings) + colorBarScale(dataset20[0].wine_servings)/2; }
                else { return w_barLabels + 10 + colorBarScale(dataset20[0].beer_servings) + colorBarScale(dataset20[0].wine_servings) + colorBarScale(dataset20[0].spirit_servings)/2; }
              });
    svg_colors.selectAll(".barGroups").select(".beerRect")
              .attr("x", function(d) { return w_barLabels + 10; })
              .attr("width", function(d) { return colorBarScale(d.beer_servings); });
    svg_colors.selectAll(".barGroups").select(".wineRect")
              .attr("x", function(d) { return w_barLabels + 10 + colorBarScale(d.beer_servings); })
              .attr("width", function(d) { return colorBarScale(d.wine_servings); });
    svg_colors.selectAll(".barGroups").select(".spiritsRect")
              .attr("x", function(d) { return w_barLabels + 10 + colorBarScale(d.beer_servings) + colorBarScale(d.wine_servings); })
              .attr("width", function(d) { return colorBarScale(d.spirit_servings); });
    // Mouseover labels
    svg_colors.selectAll(".beerLabels").remove();
    svg_colors.selectAll(".wineLabels").remove();
    svg_colors.selectAll(".spiritLabels").remove();
  }; // end resize color bars
  ////////////////////////////////////////////////////////////////////////
  ///////////////// list svg  /////////////////////////////////////
  var svg_list = d3.select("#svg-list");
  var w_svgList = w; // make it full width
  var w_list = (w_svgList)/3;
  svg_list.style("width", w_svgList);
  svg_list.style("height", (h_bar+h_barSpacing)*20 + h_typeLabels + margin.top);
  function setup_list() {
    svg_list.selectAll("beerGroups")
            .data(dataset_beer20)
            .enter()
            .append("g")
            .attr("class", "beerGroups");
    svg_list.selectAll(".beerGroups")
            .append("text")
            .attr("class", "barLabels")
            .text(function(d) { return d.country; })
            .attr("x", function() {
              if (w > 400) { return w_list*.65; }
              else { return w_list/2; }
            })
            .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .style("fill", "black")
            .style("text-anchor", function() {
              if (w > 400) { return "end"; }
              else { return "middle"; }
            });
    svg_list.selectAll(".beerGroups")
            .append("text")
            .attr("class", "barLabels numberLabels")
            .text(function(d) {
              if (w > 400) { return d.beer_servings; }
              else { return ""; }
            })
            .attr("x", 20 + w_list*.65)
            .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .style("text-anchor", "middle")
            .style("fill", orange);
    // Wine
    svg_list.selectAll("wineGroups")
            .data(dataset_wine20)
            .enter()
            .append("g")
            .attr("class", "wineGroups");
    svg_list.selectAll(".wineGroups")
            .append("text")
            .attr("class", "barLabels")
            .text(function(d) {
              if (d.country=="United Kingdom") { return "UK"; }
              else { return d.country; }
            })
            .attr("x", function() {
              if (w > 400) { return w_list*1.65; }
              else { return w_list*1.5; }
            })
            .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .style("fill", "black")
            .style("text-anchor", function() {
              if (w > 400) { return "end"; }
              else { return "middle"; }
            });
    svg_list.selectAll(".wineGroups")
            .append("text")
            .attr("class", "barLabels numberLabels")
            .text(function(d) {
              if (w > 400) { return d.wine_servings; }
              else { return ""; }
            })
            .attr("x", 20 + w_list*1.65)
            .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .style("text-anchor", "middle")
            .style("fill", pink);
    // Spirits
    svg_list.selectAll("spiritGroups")
            .data(dataset_spirit20)
            .enter()
            .append("g")
            .attr("class", "spiritGroups");
    svg_list.selectAll(".spiritGroups")
            .append("text")
            .attr("class", "barLabels")
            .text(function(d) {
              if (d.country=="St. Vincent & the Grenadines") { return "SVG"; }
              else { return d.country; }
            })
            .attr("x", function() {
              if (w > 400) { return w_list*2.65; }
              else { return w_list*2.5; }
            })
            .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .style("fill", "black")
            .style("text-anchor", function() {
              if (w > 400) { return "end"; }
              else { return "middle"; }
            });
    svg_list.selectAll(".spiritGroups")
            .append("text")
            .attr("class", "barLabels numberLabels")
            .text(function(d) {
              if (w > 400) { return d.spirit_servings; }
              else { return ""; }
            })
            .attr("x", w_list*2.65 + 20)
            .attr("y", function(d,i) { return margin.top + h_typeLabels + i*(h_bar+h_barSpacing)+(h_bar+h_barSpacing)/2 + 2; })
            .style("text-anchor", "middle")
            .style("fill", green);
    svg_list.selectAll("axisLabels")
            .data(["Beer", "Wine", "Spirits"])
            .enter()
            .append("text")
            .attr("class", "typeLabels")
            .attr("x", function(d,i) {
              if (w > 400) { return w_list*.6 + w_list*i; }
              else { return w_list/2 + w_list*i; }
            })
            .attr("y", margin.top)
            .text(function(d) { return d; })
            .style("text-decoration", "underline")
            .style("fill", "black");
  }; // end setup_list;
  function resize_list() {
    w_svgList = w;
    svg_list.style("width", w_svgList);
    w_list = w_svgList/3;
    svg_list.selectAll(".typeLabels")
            .attr("x", function(d,i) {
              if (w > 400) { return w_list*.6 + w_list*i; }
              else { return w_list/2 + w_list*i; }
            });
    // Beer
    svg_list.selectAll(".beerGroups").select(".barLabels")
            .attr("x", function() {
              if (w > 400) { return w_list*.65; }
              else { return w_list/2; }
            })
            .style("text-anchor", function() {
              if (w > 400) { return "end"; }
              else { return "middle"; }
            });
    svg_list.selectAll(".beerGroups").select(".numberLabels")
            .text(function(d) {
              if (w > 400) { return d.beer_servings; }
              else { return ""; }
            })
            .attr("x", 20 + w_list*.65);
    // Wine
    svg_list.selectAll(".wineGroups").select(".barLabels")
            .attr("x", function() {
              if (w > 400) { return w_list + w_list*.65; }
              else { return w_list*1.5; }
            })
            .style("text-anchor", function() {
              if (w > 400) { return "end"; }
              else { return "middle"; }
            });
    svg_list.selectAll(".wineGroups").select(".numberLabels")
            .text(function(d) {
              if (w > 400) { return d.wine_servings; }
              else { return ""; }
            })
            .attr("x", w_list + 20 + w_list*.65);
    // Spirits
    svg_list.selectAll(".spiritGroups").select(".barLabels")
            .attr("x", function() {
              if (w > 400) { return w_list*2 + w_list*.65; }
              else { return w_list*2.5; }
            })
            .style("text-anchor", function() {
              if (w > 400) { return "end"; }
              else { return "middle"; }
            });
    svg_list.selectAll(".spiritGroups").select(".numberLabels")
            .text(function(d) {
              if (w > 400) { return d.spirit_servings; }
              else { return ""; }
            })
            .attr("x", w_list*2 + 20 + w_list*.65);
  }
  ////////////////////////////////////////////////////////////////////////
  ///////////////// triangle svg  /////////////////////////////////////
  var svg_triangle = d3.select("#svg-triangle");
  var w_triangle = w+40;
  var h_triangle = w*Math.sqrt(3)/2;
  svg_triangle.style("width", w);
  svg_triangle.style("height", h_triangle);
  var textTriangle = document.getElementById("text-triangle");
  if (w_window >= 640) {
    textTriangle.style.width = w*.3 + "px";
    textTriangle.style.position = "absolute";
  }
  else {
    textTriangle.style.width = w + "px";
    textTriangle.style.position = "relative";
  }
  // Scales
  if (w_window > 640) { var r_max = 20; }
  else if (w_window > 500) { var r_max = 18; }
  else { var r_max = 15; }
  var rScale = d3.scaleLinear()
                 .domain([0, maxServings])
                 .range([3, r_max]);
  var corners = [[w_triangle/2, h_triangle/6+5],[w_triangle/6+5, 5/6*h_triangle-5],[w_triangle*5/6-10, 5/6*h_triangle-5]];
  function setup_triangle() {
    // Legends
    if (w_window >= 640) {
      svg_triangle.append("g").attr("class", "legendGroup").attr("transform", "translate(" + w_triangle*3/4 + "," + h_triangle/5 + ")");
    }
    else {
      svg_triangle.append("g").attr("class", "legendGroup").attr("transform", "translate(" + 20 + "," + h_triangle/5 + ")");
    }
    svg_triangle.select(".legendGroup").selectAll("legendCircles")
                .data([1,2,3,4])
                .enter()
                .append("circle")
                .attr("class", "legendCircles")
                .attr("cx", 0)
                .attr("r", function(d,i) {
                  if (i==3) { return r_max*3/4; }
                  else if (i==2) { return r_max/2; }
                  else if (i==1) { return r_max/3; }
                  else { return r_max/4; }
                })
                .attr("cy", function(d,i) {
                  if (i==0) { return -15; }
                  else if (i==1) { return r_max/4; }
                  else if (i==2) { return 18 + r_max/4 + r_max/3; }
                  else { return 40 + r_max/4 + r_max/3 + r_max/2; }
                });
    svg_triangle.select(".legendGroup").selectAll("legendText")
                .data(["Fewer drinks", "More drinks"])
                .enter()
                .append("text")
                .attr("class", "legendText")
                .text(function(d) { return d; })
                .attr("x", 25)
                .attr("y", function(d,i) {
                  if (i==0) { return -10; }
                  else { return 40 + r_max/4 + r_max/3 + r_max/2 + 5; }
                });
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
                  if (i==0) { return w_triangle/2; }
                  else if (i==1) { return w_triangle/2 - w_triangle/3; }
                  else { return w_triangle/2 + w_triangle/3; }
                })
                .attr("y", function(d,i) {
                  if (i==0) { return h_triangle/2 - h_triangle/3 - 15; }
                  else { return h_triangle/2 + h_triangle/3 + 25; }
                })
                .style("text-anchor", function(d,i) {
                  if (i==0) { return "middle"; }
                  else if (i==1) { return "start"; }
                  else { return "end"; }
                })
                .style("fill", function(d,i) {
                  if (i==0) { return orange; }
                  else if (i==1) { return pink; }
                  else { return green; }
                });
    // Draw circles
    svg_triangle.selectAll("countryCircles")
                .data(dataset.filter(function(d) { return d.total_servings>0; }))
                .enter()
                .append("circle")
                .attr("class", "countryCircles")
                .attr("r", function(d) { return rScale(d.total_servings); })
                .attr("cx", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[0]; })
                .attr("cy", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[1]; })
                .style("fill", function(d) {
                  if (d.beer_servings > d.wine_servings & d.beer_servings > d.spirit_servings) { return orange; }
                  else if (d.wine_servings > d.beer_servings & d.wine_servings > d.spirit_servings) { return pink; }
                  else if (d.spirit_servings > d.beer_servings & d.spirit_servings > d.wine_servings) { return green; }
                })
                .on("mouseover", function(d) {
                  mouseoverCircle(d3.select(this));
                })
                .on("mouseout", function() {
                  d3.select(".labelGroup").remove().exit();
                  d3.select(this).classed("countryCircles-active", false);
                  d3.selectAll(".countryCircles").classed("countryCircles-inactive", false);
                })
  }; // end setup
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
  // Mouseover circles
  function mouseoverCircle(currCircle) {
    d3.select(".labelGroup").remove().exit();
    d3.selectAll(".countryCircles").classed("countryCircles-active", false).classed("countryCircles-inactive", true);
    var currData = currCircle.data()[0];
    var currCountry = currData.country;
    var currRadius = parseFloat(currCircle.attr("r"));
    var tooltipWidth = d3.max([80, currCountry.length*7], function(d) { return d; });
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
                  .text("Beer: " + currData.beer_servings)
                  .attr("x", function(d) { return (tooltipWidth+20)/2; })
                  .attr("y", function(d) { return 40; })
    currLabelGroup.append("text")
                  .attr("class", "dataLabels")
                  .attr("id", "wineLabel")
                  .text("Wine: " + currData.wine_servings)
                  .attr("x", function(d) { return (tooltipWidth+20)/2; })
                  .attr("y", function(d) { return 60; })
    currLabelGroup.append("text")
                  .attr("class", "dataLabels")
                  .attr("id", "spiritLabel")
                  .text("Spirits: " + currData.spirit_servings)
                  .attr("x", function(d) { return (tooltipWidth+20)/2; })
                  .attr("y", function(d) { return 80; })
    currCircle.classed("countryCircles-active", true).classed("countryCircles-inactive", false);
  }; // end mouseoverCircle
  // Search bar and autocomplete
  function findCountry(country) {
    svg_triangle.selectAll(".countryCircles").classed("countryCircles-active", false);
    var currCircle = d3.selectAll(".countryCircles").filter(function(d) { return d.country == country; });
    if (currCircle.node()) { mouseoverCircle(currCircle); }
    else {
      d3.select(".labelGroup").remove().exit();
      var tooltipWidth = d3.max([80, country.length*7], function(d) { return d; });
      var tooltipHeight = 95;
      if (w_window >= 640) {
        var currY = document.getElementById("text-triangle").getBoundingClientRect().top + document.getElementById("text-triangle").getBoundingClientRect().height - document.getElementById("svg-triangle").getBoundingClientRect().top;
      }
      else {
        var currY = document.getElementsByClassName("legendGroup")[0].getBoundingClientRect().top + document.getElementsByClassName("legendGroup")[0].getBoundingClientRect().height - document.getElementById("svg-triangle").getBoundingClientRect().top;
      }
      svg_triangle.append("g")
                  .attr("class", "labelGroup")
                  .attr("transform", "translate("+ 10 + "," + (currY+25) + ")");
      svg_triangle.select(".labelGroup")
                  .append("rect")
                  .attr("class", "labelRect")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("width", tooltipWidth + 20)
                  .attr("height", tooltipHeight)
      svg_triangle.select(".labelGroup")
                  .append("text")
                  .attr("class", "dataLabels")
                  .attr("id", "countryName")
                  .text(country)
                  .attr("x", function(d) { return (tooltipWidth+20)/2; })
                  .attr("y", function(d) { return 20; });
      svg_triangle.select(".labelGroup")
                  .append("text")
                  .attr("class", "dataLabels")
                  .attr("id", "beerLabel")
                  .text("Beer: 0")
                  .attr("x", function(d) { return (tooltipWidth+20)/2; })
                  .attr("y", function(d) { return 40; })
      svg_triangle.select(".labelGroup")
                  .append("text")
                  .attr("class", "dataLabels")
                  .attr("id", "wineLabel")
                  .text("Wine: 0")
                  .attr("x", function(d) { return (tooltipWidth+20)/2; })
                  .attr("y", function(d) { return  60; })
      svg_triangle.select(".labelGroup")
                  .append("text")
                  .attr("class", "dataLabels")
                  .attr("id", "spiritLabel")
                  .text("Spirits: 0")
                  .attr("x", function(d) { return (tooltipWidth+20)/2; })
                  .attr("y", function(d) { return 80; })
    }; // end else
  }; // end findCountry
  function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
    var currentFocus;
  /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      var searchbar = d3.select(".searchbar-input");
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.style.width = searchbar.style("width");
      a.style.left = searchbar.node().getBoundingClientRect().left + "px";
      a.style.top = (searchbar.node().getBoundingClientRect().top + document.documentElement.scrollTop + parseInt(searchbar.style("height"), 10) + 4) + "px"; // border takes up 2px above + below
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:
              Run update on graphic */
              closeAllLists();
              findCountry(inp.value);
              inp.value="";
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          save old variable
          increase the currentFocus variable:*/
          old = currentFocus;
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
          if (old > -1) {
            x[old].style.backgroundColor = d3.color("#fff");
            x[old].style.color = "black";
          }
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          old = currentFocus;
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
          if (old > -1) {
            x[old].style.backgroundColor = d3.color("#fff");
            x[old].style.color = "black";
          }
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    }); // end add event listener
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
      x[currentFocus].style.color = "white";
      x[currentFocus].style.backgroundColor = green;
    }; // end addActive
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }; // end removeActive
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }; // end closeAllLists
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }; // end autocomplete
  function wrap(text, width) { // text wrapping function
    text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.3, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
                      .append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word);
          }
      }
    });
  }; // end wrap function
  function resize_triangle() {
    var textTriangle = document.getElementById("text-triangle");
    if (w_window >= 640) {
      textTriangle.style.width = w*.3 + "px";
      textTriangle.style.position = "absolute";
    }
    else {
      textTriangle.style.width = w + "px";
      textTriangle.style.position = "relative";
    }
    w_triangle = w+40;
    h_triangle = w*Math.sqrt(3)/2;
    svg_triangle.style("width", w);
    svg_triangle.style("height", h_triangle);
    corners = [[w_triangle/2, h_triangle/6+5],[w_triangle/6+5, 5/6*h_triangle-5],[w_triangle*5/6-10, 5/6*h_triangle-5]];
    if (w_window > 640) { var r_max = 20; }
    else if (w_window > 500) { var r_max = 18; }
    else { var r_max = 15; }
    rScale = d3.scaleLinear()
               .domain([0, maxServings])
               .range([3, r_max]);
    // Legends
    if (w_window >= 640) {
      svg_triangle.select(".legendGroup").attr("transform", "translate(" + w_triangle*3/4 + "," + h_triangle/5 + ")");
    }
    else {
      svg_triangle.select(".legendGroup").attr("transform", "translate(" + 20 + "," + h_triangle/5 + ")");
    }
    svg_triangle.select(".legendGroup").selectAll(".legendCircles")
                .attr("r", function(d,i) {
                  if (i==3) { return r_max*3/4; }
                  else if (i==2) { return r_max/2; }
                  else if (i==1) { return r_max/3; }
                  else { return r_max/4; }
                })
                .attr("cy", function(d,i) {
                  if (i==0) { return -15; }
                  else if (i==1) { return r_max/4; }
                  else if (i==2) { return 18 + r_max/4 + r_max/3; }
                  else { return 40 + r_max/4 + r_max/3 + r_max/2; }
                });
     svg_triangle.select(".legendGroup").selectAll(".legendText")
                 .attr("y", function(d,i) {
                   if (i==0) { return -10; }
                   else { return 40 + r_max/4 + r_max/3 + r_max/2 + 5; }
                 });
    // Draw triangle
    svg_triangle.select(".triangle")
                .attr("transform", "translate("+ w_triangle/2 + ", " + h_triangle/2 + ")")
                .select("path")
                .attr("d", "M 0 " + (-h_triangle/3) + " L " + (-w_triangle/3) + " " + (h_triangle/3) + "L " + (w_triangle/3) + " " + (h_triangle/3) + " Z");
    // Draw labels
    svg_triangle.selectAll(".axisLabels")
                .attr("x", function(d,i) {
                  if (i==0) { return w_triangle/2; }
                  else if (i==1) { return w_triangle/2 - w_triangle/3; }
                  else { return w_triangle/2 + w_triangle/3; }
                })
                .attr("y", function(d,i) {
                  if (i==0) { return h_triangle/2 - h_triangle/3 - 15; }
                  else { return h_triangle/2 + h_triangle/3 + 25; }
                });
    // Draw circles
    svg_triangle.selectAll(".countryCircles")
                .attr("r", function(d) { return rScale(d.total_servings); })
                .attr("cx", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[0]; })
                .attr("cy", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[1]; });
    // Remove any mouseover groups
    svg_triangle.selectAll(".labelGroup").remove().exit();
    svg_triangle.selectAll(".countryCircles").classed("countryCircles-active", false);
  };
  ////////////////////////////////////////////////////////////////////////
  // Set up
  setup_bars();
  setup_colors();
  setup_list();
  setup_triangle();
  // Resize
  window.addEventListener("resize", function() {
    w = document.getElementById("main").getBoundingClientRect().width;
    w_window = document.body.clientWidth;
    if (w_window <= 400) { w_barLabels = 85; }
    else { w_barLabels = 95; }
    resize_bars();
    resize_colorBars();
    resize_list();
    resize_triangle();
  }); // end resize function

  // Interactivity
  // Triangle page
  var countryList = [];
  for (var i=0; i<dataset.length; i++) {
    countryList.push(dataset[i].country);
  }
  autocomplete(document.getElementById("searchbar-country"), countryList); // autocomplete for search bar

}; // end init
function rowConverter(d) {
  return {
    country: d.country,
    beer_servings: parseInt(d.beer_servings),
    spirit_servings: parseInt(d.spirit_servings),
    wine_servings: parseInt(d.wine_servings),
    total_servings: parseInt(d.beer_servings)+parseInt(d.spirit_servings)+parseInt(d.wine_servings),
    total_litres_of_pure_alcohol: parseFloat(d.total_litres_of_pure_alcohol),
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
