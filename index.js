function init_triangle() {
  var w = document.getElementById("main").getBoundingClientRect().width;
  // Triangle svg
  var svg_triangle = d3.select("#svg-triangle");
  var w_triangle = w;
  var h_triangle = w*Math.sqrt(3)/2;
  svg_triangle.style("width", w);
  svg_triangle.style("height", h_triangle);
  // Colors
  var green = d3.color("#767A00");
  // Scales
  var rScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, function(d) { return d.total_litres_of_pure_alcohol; })])
                 .range([3, 20]);
  var corners = [[w_triangle/2, h_triangle/6+5],[w_triangle/6+5, 5/6*h_triangle-5],[w_triangle*5/6-10, 5/6*h_triangle-5]];

  // Functions
  function setup() {
    // Legends
    svg_triangle.append("g").attr("class", "legendGroup").attr("transform", "translate(" + 40 + "," + 270 + ")");
    svg_triangle.select(".legendGroup").selectAll("legendCircles")
                .data([1,2,3,4])
                .enter()
                .append("circle")
                .attr("class", "legendCircles")
                .attr("cx", 0)
                .attr("cy", function(d,i) {
                  if (i==0) { return -15; }
                  else if (i==1) { return 5; }
                  else if (i==2) { return 30; }
                  else { return 60; }
                })
                .attr("r", function(d,i) { return 3*(i+1); })
    svg_triangle.select(".legendGroup").selectAll("legendText")
                .data(["Less consumption", "More consumption"])
                .enter()
                .append("text")
                .attr("class", "legendText")
                .text(function(d) { return d; })
                .attr("x", 20)
                .attr("y", function(d,i) {
                  if (i==0) { return -10; }
                  else { return 65; }
                });
    // Instructions
    svg_triangle.append("text")
                .text("Each dot on the triangle is a country. The closer the dot is to a particular alcoholic drink, the more likely it is for an average person in that country to consume that drink than the others. The larger the dot, the more alcohol is consumed by the average person in that country.")
                .attr("class", "instructions")
                .attr("x", 20)
                .attr("y", 60)
                .call(wrap, 250);
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
                .data(dataset.filter(function(d) { return d.total_litres_of_pure_alcohol>0; }))
                .enter()
                .append("circle")
                .attr("class", "countryCircles")
                .attr("r", function(d) { return rScale(d.total_litres_of_pure_alcohol); })
                .attr("cx", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[0]; })
                .attr("cy", function(d) { return coord([d.beer_share, d.wine_share, d.spirit_share])[1]; })
                .on("mouseover", function(d) {
                  d3.selectAll(".countryCircles").classed("countryCircles-active", false);
                  var currCircle = d3.select(this);
                  var currCountry = d.country;
                  var currRadius = parseFloat(d3.select(this).attr("r"));
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
  // Search bar and autocomplete
  function findCountry(country) {
    svg_triangle.selectAll(".countryCircles")
                .classed("countryCircles-active", false)
                .filter(function(d) { return d.country == country; })
                .classed("countryCircles-active", true);
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
  // Run the initial set up load
  setup();

  // Interactivity after load
  var countryList = [];
  for (var i=0; i<dataset.length; i++) {
    countryList.push(dataset[i].country);
  }
  autocomplete(document.getElementById("searchbar-country"), countryList); // autocomplete for search bar

}; // end init_triangle

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
  init_triangle();
})