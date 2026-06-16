let globaldata;

var pos = d3.json("./meteo.json")
.then(drawCircles).catch(console.error);

    
    
function selectDay()  {

    day = document.getElementById("selectDay").value;
    //erase();
    idsta = document.getElementById("myStationSelected").value;

    document.getElementById("titleday").innerHTML = "Jour " + day;

    pos = d3.json("./meteo.json")
    .then(updateMap).catch(console.error);
    
    if(idsta != 'Aucune'){ // si le select station n'est pas sur rien
        pushDataChart3n4(globaldata[day].station, idsta); // on push les datas à chaque jour changé
        updateChart(); // on updates les charts 3 et 4
    }
}

function selectHour(){
    hour = document.getElementById("selectHour").value;
    //alert(hour);
    //erase();
    pos = d3.json("./meteo.json")
    .then(updateMap).catch(console.error);
}


    
    
        
        
    function drawCircles(data) {
        globaldata = data; // copie pour update les charts
        document.getElementById('titleday').innerHTML = 'Jour '+ day;
        //3.1 Créons une sélection d3 de cercles, dans quelle balise elle seront
        let stations = svg.selectAll("circle")
        //3.2 Joignons les données à la sélection
        .data(data[day].station);
        //3.3 Lions les données à la sélection
        let virtualCircles = stations.enter()
        // Ajoutons les éléments SVG
        .append("circle");
        //3.4 Modifions les attributs de nos cercles en fonction des données
        virtualCircles
        .attr('class', 'city')
        .attr("transform", function (d) { // positions des circles
			return "translate(" + projection([
				d.lng,
				d.lat
			]) + ")";
		})
        .attr("r", data => { // le rayon du circle
        return 9; // ♦♣♠ modif
        })
        //.attr("fill", "orange")
        //////// tooltip
        .on("mouseover", function(d) {
                divCity.transition()
                .duration(200)
                .style("opacity", .9);
                divCity.html( 
                        // les données sont piochées dans cette fonction en type string
                        getHourToTooltip(d, data) + "<br/>" 
                    ) // le dom d. est calibré sur 1 station, on doit passer par data pour le jour
                .style("left", (d3.event.pageX  - 190) + "px")
                .style("top", (d3.event.pageY - 120) + "px")
            })
            .on("mouseout", function(d) {
                divCity.transition()
                    .duration(200)
                    .style("opacity", 0);
                divCity.html("")
                    .style("left", (d3.event.pageX  - 190) + "px")
                    .style("top", (d3.event.pageY - 120) + "px");
            })
        ;
        ///////////////////////////////////////////////////////////////
        ////////////////   GET TOOLTIP
        ///////////////////////////////////////////////////////////////
        function getHourToTooltip(d2, data2){
                //alert("hour dansget : "+ hour);
                if(hour == 8)
                {
                    
                    return  "Jours : " + data2[day].d + "<br/>"
                    + "Jour entier <br/>"
                    + "Ville : " + d2.n + "<br/>"
                    +  "Temperature : " + Math.round(d2.t/100) + "<br/>"
                    + "Pluie : " + d2.p + " mm<br/>";
                }
                else
                {    
                    temperature = Math.round(d2.hours[hour / 3].t/100);
                    return "Jours : " + data2[day].d + "<br/>"
                    + "À " + d2.hours[hour / 3].h + "h00 <br/>"
                    + "Ville : " + d2.n + "<br/>"
                    +  "Temperature : " + temperature + "<br/>"
                    + "Pluie : " + d2.hours[hour / 3].p + " mm<br/>";
        
                }
        }

        // Append a DIV for the tooltip
        var divCity = d3.select("body").append("div")
            .attr("class", "tooltipCity")
            .style("opacity", 0);
        




            //////////////////////////////////////////////////////////////////////
            /////////////////            VIRTUAL TEXT
            //////////////////////////////////////////////////////////////////////


        


        let virtualText = svg.selectAll("text")
        .data(data[day].station); //svg.selectall.data.enter.append

        
        
        virtualText
        .enter()//////// text pour temperature
        .append("text").text(function(d){
            //console.debug("DOM: "+d.hours[4]);
            
            for(let hours of d.hours){
				if(hours.h == hour){
					return Math.round(hours.t/100);
                }
			}  
            if(hour == 8)
				return Math.round(d.t/100);

        })
        .attr("class", "vitualText")
        .attr("transform", function (d) {
			return "translate(" + projection([
				d.lng -0.40,
				d.lat + 0.25
			]) + ")";
        })
        .style("font-size", 14) 
        //.style("fill", "tomato") // police et couleur
        ;

      

    };
    




    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////   UPDATE MAP
    ////////////////////////////////////////////////////////////////////////////


        
    function updateMap(data) {
        //alert(data);
        //3.1 Créons une sélection d3 de cercles, dans quelle balise elle seront
        let stations = svg.selectAll("circle")
        //3.2 Joignons les données à la sélection
        .data(data[day].station);
        //3.3 Lions les données à la sélection
        let virtualCircles = stations.join("circle")
        // Ajoutons les éléments SVG
        //.append("circle")
        ;
       
        //3.4 Modifions les attributs de nos cercles en fonction des données
        virtualCircles
        .attr('class', 'city')
        .attr("transform", function (d) { // positions des circles
			return "translate(" + projection([
				d.lng,
				d.lat
			]) + ")";
		})
        .attr("r", data => { // le rayon du circle
        return 9; // ♦♣♠ modif
        })
        //.attr("fill", "orange")
        //////// tooltip
        .on("mouseover", function(d) {
                divCity.transition()
                .duration(200)
                .style("opacity", .9);
                divCity.html( 
                        // les données sont piochées dans cette fonction en type string
                        getHourToTooltip(hour, d, data) + "<br/>" 
                    ) // le dom d. est calibré sur 1 station, on doit passer par data pour le jour
                .style("left", (d3.event.pageX  - 190) + "px")
                .style("top", (d3.event.pageY - 120) + "px")
            })
            .on("mouseout", function(d) {
                divCity.transition()
                    .duration(200)
                    .style("opacity", 0);
                divCity.html("")
                    .style("left", "0px")
                    .style("top", "0px");
            })
        ;
       
        ///////////////////////////////////////////////////////////////
        ////////////////   GET TOOLTIP
        ///////////////////////////////////////////////////////////////
        function getHourToTooltip(h2, d2, data2){
                //alert("hour dansget : "+ hour);
                if(hour == 8)
                {
                    
                    return  "Jours : " + data2[day].d + "<br/>"
                    + "Jour entier <br/>"
                    + "Ville : " + d2.n + "<br/>"
                    +  "Temperature : " + Math.round(d2.t/100) + "<br/>"
                    + "Pluie : " + d2.p + " mm<br/>";
                }
                else
                {    
                    temperature = Math.round(d2.hours[hour / 3].t/100);
                    return "Jours : " + data2[day].d + "<br/>"
                    + "À " + d2.hours[hour / 3].h + "h00 <br/>"
                    + "Ville : " + d2.n + "<br/>"
                    +  "Temperature : " + temperature + "<br/>"
                    + "Pluie : " + d2.hours[hour / 3].p + " mm<br/>";
        
                }
        }

        // Append a DIV for the tooltip
        var divCity = d3.select("body").append("div")
            .attr("class", "tooltipCity")
            .style("opacity", 0);
        




        ///////////////////////////////////////////////////////////////////////
        /////////////////            VIRTUAL TEXT
        ///////////////////////////////////////////////////////////////////////

        let virtualText = svg.selectAll("text")
        .data(data[day].station); //svg.selectall.data.enter.append

        
        virtualText
        .join(//////// text pour temperature carte
        enter => enter.append("text"),
        update => update.text(function(d){
          
            for(let hours of d.hours){
				if(hours.h == hour){
					return Math.round(hours.t/100);
                }
			}  
            if(hour == 8)
				return Math.round(d.t/100);

        }))
        .attr("class", "vitualText")
        .attr("transform", function (d) {
			return "translate(" + projection([
				d.lng -0.40,
				d.lat + 0.25
			]) + ")";
        })
        .style("font-size", 14) 
        //.style("fill", "tomato") // police et couleur
        ;

      

    };
    



