
if (Object.keys(obj).length != 0) {
    flights = d3.select("#flights");

    flights.select("tbody")
        .selectAll("tr")
        .data(obj)
        .enter()
        .append("tr")
        .html(function(d) {
            var dep = new Date(`${d.filed_departuretime}` *1000).toLocaleString();
            var arr = new Date(`${d.estimatedarrivaltime}` *1000).toLocaleString();
            return `<td>${d.ident}</td><td>${d.aircrafttype}</td><td>${d.originCity}</td>
            <td>${d.destinationCity}</td>
            <td>${dep}</td>
            <td>${arr}</td>
            <td><a href="/flightmap/${d.faFlightID}/${d.origin}/${d.destination}">Map It</a></td>`;
    });
}

if (Object.keys(obj3).length != 0) {
    console.log(typeof obj3);

    chartdata = d3.select("#chartdata");

    chartdata.select("tbody")
        .selectAll("tr")
        .data(obj3)
        .enter()
        .append("tr")
        .html(function(d) {
            return `<td>${d.ident}</td><td>${d.avgdeparture}</td><td>${d.avgarrival}</td><td>${d.count}</td>`;
    });

    var trace1 = {
        x: jsontolist(obj3, 'ident'),
        y: jsontolist(obj3, 'avgdeparture'),
        name: 'Departures',
        type: 'bar'
    }

    var trace2 = {
        x: jsontolist(obj3, 'ident'),
        y: jsontolist(obj3, 'avgarrival'),
        name: 'Arrivals',
        type: 'bar'
    }

    var data = [trace1, trace2];
    var layout = {
        title: 'Average Times',
        xaxis: {
            tickangle: -45
        },
        barmode: 'group',
        showlegend: true,
        legend: {
            x: 1,
            y: 0.5
        }
    };
    Plotly.newPlot('myChart', data, layout);

}

function jsontolist(data, key) {
    var result = "";
    
    for ( var i in data) {
            result += "" + data[i][key] + ", ";
	}
    result = result.replace(/,\s*$/, "");
    if (typeof data[i][key] == "number") {
        result = JSON.parse("[" + result + "]");
    }
    if (typeof data[i][key] == "string") {
        result = result.split(", ");
    }
    
    return result;
  }

 d3.select("#origin")
    .selectAll("option")
    .data(obj2)
    .enter()
    .append("option")
    .text(function (d) { 
        var text = d.Name + " (" + d.IATA + ")"; 
        return text; 
    })
    .attr('value', function (d) {
        var value = d.ICAO;
        return value;
    });

d3.select("#destination")
    .selectAll("option")
    .data(obj2)
    .enter()
    .append("option")
    .text(function (d) { 
        var text = d.Name + " (" + d.IATA + ")"; 
        return text; 
    })
    .attr('value', function (d) {
        var value = d.ICAO;
        return value;
    });


var objSelect = document.getElementById("origin");
setSelectedValue(objSelect, origin);
objSelect = document.getElementById("destination");
setSelectedValue(objSelect, destination);

function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].value == valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}



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
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
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
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
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
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

//autocomplete(document.getElementById("Origin"), obj2);
//autocomplete(document.getElementById("Destination"), obj2);