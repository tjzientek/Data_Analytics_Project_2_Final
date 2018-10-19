d3.select("tbody")
    .selectAll("tr")
    .data(obj)
    .enter()
    .append("tr")
    .html(function(d) {
        return `<td>${d.Airport_ID}</td><td>${d.Name}</td><td>${d.City}</td><td>${d.Country}</td><td>${d.IATA}</td><td>${d.ICAO}</td>`;
 });