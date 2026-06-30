let globaldata;

// chemin fichier icone des conditions météo
let iconSunCloud;
// pour soustraire 1 jour du day
let dayminone = 1;
let hourtitle;


idsta = document.getElementById("station-select").value;

var datachart = d3.json("./meteo.json")
    .then(drawChart).catch(console.error);

var pos = d3.json("meteo.json")
    .then(drawCircles).catch(console.error);
// pos = d3.json("meteo.json")
    // .then(updateMap).catch(console.error);


document.getElementById('day-select').addEventListener('change', function (e) {

    // select des données sur le jour
    selectDay(e);
    // mise à jour de l'icone condition météo
    iconSunCloud = change_icone_condition_meteo();
    d3.select("#logo-sun-cloud").attr("src", () => { return iconSunCloud });
});

/**
 * 
 * @param {Event} e 'EventListener' from selected day
 * @description get value of a day selected in front
 * @returns any
 */
function selectDay(e) {

    day = e.value ? e.value : document.getElementById("day-select").value;
    idsta = document.getElementById("station-select").value;
    dayminone = parseInt(day-1);

    document.getElementById('titleday').innerText = 'Jour ' + day + " : " + hourtitle;

    document.getElementById('station-temp').innerText = Math.round(globaldata[dayminone].station[idsta]?.t / 100) + "°C";


    pos = d3.json("./meteo.json")
        .then(updateMap).catch(console.error);

    if (idsta != 'Global') { // si le select station n'est pas sur rien
        pushDataChart3n4(globaldata[dayminone].station, idsta); // on push les datas à chaque jour changé
        //     updateChart(); // on updates les charts 3 et 4
    }
}

document.getElementById('hour-select').addEventListener('change', function (e) {
    // mise à jour de l'icone condition météo


    iconSunCloud = change_icone_condition_meteo();
    d3.select("#logo-sun-cloud").attr("src", () => { return iconSunCloud });

    selectHour(e);
});

/**
 * 
 * @param {Event} e 'EventListener' from selected hour
 * @description get value of a day selected in front
 * @returns any
 */
function selectHour(e) {
    hour = document.getElementById("hour-select").value;

    hourtitle = hour == 8 ? " sur 24 heures" : " à " + hour + " h";
    document.getElementById("titleday").innerHTML = "Jour " + (day) + " : " + hourtitle;

    //alert(hour);
    //erase();
    pos = d3.json("./meteo.json")
        .then(updateMap).catch(console.error);

    day = document.getElementById("day-select").value;

    idsta = document.getElementById("station-select").value;

    pushDataChart3n4(globaldata[day].station, idsta); // on push les datas à chaque jour changé
    // updateChart(); // on updates les charts 3 et 4
}

// couleur des chiffres temp° sur la carte de France
let redgreenblue = "rgb(250, 250, 250)"


function drawCircles(data) {
    // alert("data ?? \n ↓↓↓↓ \n" + data)
    hourtitle = hour == 8 ? " sur 24 heures" : " à " + hour + " heures";

    globaldata = data; // copie pour update les charts
    document.getElementById('titleday').innerText = 'Jour ' + day + " : " + hourtitle;
    // document.getElementById('station-temp').innerText = temp;
    dayminone = parseInt(day-1);

    document.getElementById('station-temp').innerText = Math.round(data[0].station[0]?.t / 100) + "°C";


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
        .on("mouseover", function (d) {
            divCity.transition()
                .duration(200)
                .style("opacity", .9);
            divCity.html(
                // les données sont piochées dans cette fonction en type string
                getHourToTooltip(d, data) + "<br/>"
            ) // le dom d. est calibré sur 1 station, on doit passer par data pour le jour
                .style("left", (d3.event.pageX - 190) + "px")
                .style("top", (d3.event.pageY - 120) + "px")
        })
        .on("mouseout", function (d) {
            divCity.transition()
                .duration(200)
                .style("opacity", 0);
            divCity.html("")
                .style("left", (d3.event.pageX - 190) + "px")
                .style("top", (d3.event.pageY - 120) + "px");
        })
        ;
    ///////////////////////////////////////////////////////////////
    ////////////////   GET TOOLTIP
    ///////////////////////////////////////////////////////////////
    function getHourToTooltip(d2, data2) {
        
        // alert("hour dansget : "+ hour);
        if (hour == 8) {

            return "Jour : " + data2[dayminone].d + "<br/>"
                + "Jour entier <br/>"
                + "Ville : " + d2.n + "<br/>"
                + "Temperature : " + Math.round(d2.t / 100) + "<br/>"
                + "Pluie : " + d2.p + " mm<br/>";
        }
        else {
            temperature = Math.round(d2.hours[hour / 3].t / 100);
            return "Jour : " + data2[dayminone].d + "<br/>"
                + "À " + d2.hours[hour / 3].h + "h00 <br/>"
                + "Ville : " + d2.n + "<br/>"
                + "Temperature : " + temperature + "<br/>"
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
        .data(data[dayminone].station); //svg.selectall.data.enter.append

    virtualText
        .enter()//////// text pour temperature
        .append("text").text( (d/*, k, classArray*/) => {
            if(d.n == "NICE")
            console.log("d:::::::",d)
            for (let hours of d.hours) {
                if (hours?.h == hour) {
                    // redgreenblue = "rgb(250,250,250,1)";
                    // redgreenblue = tempcolorontext((Math.round(hours.t / 100)), redgreenblue);
                    // svg.select("text").style("fill", redgreenblue);
                    
                    return Math.round(hours?.t / 100);
                }
            }
            if (hour == 8){
                // redgreenblue = "rgb(250,250,250,1)";
                // redgreenblue = tempcolorontext((Math.round(d.t / 100)), redgreenblue);
                // svg.select("text").style("fill", redgreenblue);
                return Math.round(d.t / 100);
            }
        })
        .attr("class", "virtualTxt")
        .attr("transform", function (d) {
            
            return "translate(" + projection([
                d.lng - 0.40,
                d.lat + 0.25
            ]) + ")";
        })
        .attr("style", function (d) {
            for (let hours of d.hours) {
                if (hours.h == hour) {
                    return "fill: " + tempcolorontext((Math.round(hours.t / 100)), redgreenblue) + ";"
                }
                if (hour == 8){
                    return "fill: " + tempcolorontext((Math.round(d.t / 100)), redgreenblue) + ";"
                }
            }
        })
        .style("font-size", 22)
        // .style("fill", `rgb(250,250,250,1)`);
        // .style("fill", `${redgreenblue}`);
        console.log("virtualText =>>> ", virtualText)


};

/**
 * 
 * @param {Int|float} temp température du chiffre coloré
 * @param {RGB()} redgreenblue données des couleurs actuelle avant modifications
 * @returns Obj rgb
 */
function tempcolorontext(temp,regreeblu){
    // si temp > 30 alors r = 254, b = 0
    // si temp <30 && > 25 alors r = 192, b = 64 etc etc ....
    
    if(temp > 15)               regreeblu = 'rgb(255, 142, 67)';
    if(temp > 15 && temp <= 25) regreeblu = 'rgb(250, 173, 8)';
    if(temp <= 15 && temp > 10) regreeblu = 'rgb(229, 245, 8)';   // "#a5a32a"
    if(temp <= 10 && temp > 5)  regreeblu = 'rgb(57, 250, 9)';   // "#a5a32a"
    if(temp <= 5 && temp > 0)   regreeblu = 'rgb(37, 230, 255)';  // "#2a81b3"
    if(temp <= 0)               regreeblu = 'rgb(192, 248, 255)';   // "#1ff0e5"

    // console.log("rgb: => >>>   ",regreeblu)
    // console.log("temp: => >>>   ",temp)
    

    return regreeblu;
}


////////////////////////////////////////////////////////////////////////////
/////////////////////////   UPDATE MAP
////////////////////////////////////////////////////////////////////////////



function updateMap(data) {


    dayminone = parseInt(day-1)
    // alert("DATA ??? ↓\n"+data);
    // alert(" updateMap() ↓\n"+data);
    //3.1 Créons une sélection d3 de cercles, dans quelle balise elle seront
    let stations = svg.selectAll("circle")
        //3.2 Joignons les données à la sélection
        .data(data[dayminone].station);
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
        .on("mouseover", function (d) {
            divCity.transition()
                .duration(200)
                .style("opacity", .9);
            divCity.html(
                // les données sont piochées dans cette fonction en type string
                getHourToTooltip(hour, d, data) + "<br/>"
            ) // le dom d. est calibré sur 1 station, on doit passer par data pour le jour
                .style("left", (d3.event.pageX - 190) + "px")
                .style("top", (d3.event.pageY - 120) + "px")
        })
        .on("mouseout", function (d) {
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
    function getHourToTooltip(h2, d2, data2) {
        dayminone = parseInt(day-1);
        //alert("hour dansget : "+ hour);
        if (hour == 8) {

            return "Jour : " + data2[dayminone].d + "<br/>"
                + "Jour entier <br/>"
                + "Ville : " + d2.n + "<br/>"
                + "Temperature : " + Math.round(d2.t / 100) + "<br/>"
                + "Pluie : " + d2.p + " mm<br/>";
        }
        else {
            // console.log("debug d2.hours ↓↓\n" , d2.hours)
            temperature = Math.round(d2.hours[hour / 3].t / 100);
            return "Jour : " + data2[dayminone].d + "<br/>"
                + "À " + d2.hours[hour / 3].h + "h00 <br/>"
                + "Ville : " + d2.n + "<br/>"
                + "Temperature : " + temperature + "<br/>"
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
        .data(data[dayminone].station); //svg.selectall.data.enter.append
    

    virtualText
        .join(//////// text pour temperature carte
            enter => enter.append("text"),
            // d: données, k: ville (id / key)
            update => update.text( (d/*, k, classArray*/) => {
                // console.log("d::::::", d)
                // console.log("k::::::", k)
                // console.log("ClassArray:::", classArray)
                // classArray[0].style = "virtualTxt TEST00";
                // classArray[1].style = "virtualTxt TEST11";
                // console.log("Class[0]:::", classArray[0].style)
                // console.log("Class[1]:::", classArray[1].style)
                // console.log("Class[2]:::", classArray[2])

                for (let hours of d.hours) {
                    if (hours.h == hour) {
                        // redgreenblue = "rgb(250,250,250,1)";
                        redgreenblue = tempcolorontext((Math.round(hours.t / 100)), redgreenblue)
                        svg.select("text").style("fill", redgreenblue);
                        return Math.round(hours.t / 100);
                    }
                }
                if (hour == 8){
                    // redgreenblue = "rgb(250,250,250,1)";
                    redgreenblue = tempcolorontext((Math.round(d.t / 100)), redgreenblue)
                    svg.select("text").style("fill", redgreenblue);
                    return Math.round(d.t / 100);
                }
            })
        )
        .attr("class", "virtualTxt")
        .attr("transform", function (d) {
            return "translate(" + projection([
                d.lng - 0.40,
                d.lat + 0.25
            ]) + ")";
        })
        .attr("style", function (d) {
            for (let hours of d.hours) {
                if (hours.h == hour) {
                    return "fill: " + tempcolorontext((Math.round(hours.t / 100)), redgreenblue) + ";"
                }
                if (hour == 8){
                    return "fill: " + tempcolorontext((Math.round(d.t / 100)), redgreenblue) + ";"
                }
            }
        })
        .style("font-size", 22)
        // .style("fill", `rgb(250,250,250,1)`);

        // .style("fill", `${redgreenblue}`);
        // console.log("virtualText::: >>> ",virtualText);
        



};






// copy from drawChart.js

let data3 = [];
let data4 = [];
var _labels2 = []; // labels heures
var cityName = '...';

// param: la station, l'id du selectStation
function pushDataChart3n4(une_station, id) {
    // nettoyage des anciennes données s'il y en a
    data3.splice(0, data3.length);
    data4.splice(0, data4.length);
    _labels2.splice(0, _labels2.length);
    data3.length = 0;
    data4.length = 0;
    _labels2.length = 0; // par sécurité

    // console.log("une_station");
    // console.log(une_station);

    for (let heure of une_station[id].hours) {
        // les données ne maj pas en fonction du jour, il faut aller piocher à partir de datach
        data3.push(Math.round(heure.p)); // push des données graphiques, pluie
        data4.push(Math.round(heure.t / 100)); // temp°
        _labels2.push(heure.h);
    }
    /*d.hours.forEach(heure => {
        
    });*/

}

let condition_icon = {
    "soleil": "./ressources/jour/01d.svg",
    "eclaircies": "./ressources/jour/02d.svg",
    "nuageux": "./ressources/jour/03d.svg",
    "pluie": "./ressources/jour/09d.svg",
    "torrent": "./ressources/jour/10d.svg",
    "orage": "./ressources/jour/11d.svg",
    "neige": "./ressources/jour/13d.svg",
}

/**
 * 
 * @param {*} datach Données météorologiques (pluie, température etc)
 * @returns any
 */
function drawChart(datach) {

    var valueoption = 0;

    let monselect = d3.select("#station-select");
    
    monselect.append("option")
        .text("Nice") // option par defaut
        .attr("value", function (d) {
            return 0;
        })
        .attr("selected", true); //

    // options de toute les stations
    monselect.selectAll().data(datach[day].station)
        .enter()
        .append("option")
        .text(function (d) {
            return d.n;
        })
        .attr("value", function (d) {
            return valueoption++;
        })
        .attr("id", function (d) {
            return "station";
        });

    document.getElementById('station-select').addEventListener('change', function (e) {
        let iconSunCloudSta = change_icone_condition_meteo();
        idsta = document.getElementById("station-select").value;

        document.getElementById('station-temp').innerText = Math.round(datach[day].station[idsta]?.t / 100) + "°C";

        d3.select("#logo-sun-cloud").attr("src", () => { return iconSunCloudSta });
        
    });

}
let taux = [];
let moyenneHum = 0;
let moyTemp = 0;
var total = 0;
let triggerlightning = Math.random() * 30;

// fonction qui calcul sur les données random, je devrai plutôt le faire sur meteo.json, flemme c'est une demo
// function change_icone_condition_meteo() {
let change_icone_condition_meteo = () => {
    
    taux = singleDayChart.data.datasets[2].data;
    let avg = function(taux) {
        total = 0;
        for (var i = 0; i < taux.length; i++) {
            total += taux[i];
        }
        return ( total / taux.length );
    }
    moyenneHum = avg(taux);
    moyTemp = avg(singleDayChart.data.datasets[0].data);
    avg = 0;
    triggerlightning = parseInt(Math.random() * 30);
    let stationcondition = document.getElementById("station-condition");

    for (let ldata of singleDayChart.data.datasets) {
        if(ldata.label == 'Temp (°C)') {
            // ORAGE
            if(triggerlightning == 29){
                // ICI changer l'icone composant 5 random soit jaune soit orange
                // penser aussi à faire canicule
                stationcondition.innerText = "Orageux"; return condition_icon.orage;
            }
            // NEIGE HIVER
            if(moyenneHum > 30 && moyTemp < 15){ stationcondition.innerText = "Neiges"; return condition_icon.neige;}
        }
        if(ldata.label == 'Humidité') {
        if(moyenneHum <= 10)                   { stationcondition.innerText = "Ensoleillé";    return condition_icon.soleil;  }
        if(moyenneHum > 10 && moyenneHum <= 15){ stationcondition.innerText = "Éclaircies";    return condition_icon.eclaircies;  }
        if(moyenneHum > 15 && moyenneHum <= 20){ stationcondition.innerText = "Nuageux";    return condition_icon.nuageux;  }
        if(moyenneHum > 20 && moyenneHum <= 30){ stationcondition.innerText = "Pluies";    return condition_icon.pluie;  }
        if(moyenneHum > 30)                    { stationcondition.innerText = "Précipitations";    return condition_icon.torrent;  }
    }

    }

    // return "comment connaitre la condition, peut être en regardant les données du composant 4"
}

// peut être inutile, surement à suppr
function updateChart() {
    // les 2 charts suivant se trouvent en bas de page
    // PLUVIOMETTER ON STATION AND DAY 3

    //console.log(data4);

    // Chart.defaults.global.title.text = [" Jour " + day, "' Pluie et Temperature globales à " + cityName + " '"];

    // var ctx3 = document.getElementById('myChart3').getContext('2d');
    // var ctx4 = document.getElementById('myChart4').getContext('2d');

    // var chart3 = new Chart(ctx3, {
    //     // The type of chart we want to create
    //     type: 'line',

    //     // The data for our dataset
    //     data: {
    //         labels: _labels2,
    //         datasets: [
    //             {
    //                 label: 'Pluie(mm)',
    //                 backgroundColor: 'rgb(35, 128, 255, 0.1)',
    //                 borderColor: 'rgb(0, 160, 255)',
    //                 data: data3, //
    //                 borderWidth: '5'

    //             }]
    //     },

    //     // Configuration options go here
    //     options: {

    //         legend: { labels: { fontColor: 'rgb(231, 245, 255)', fontSize: 15 } },
    //         title: {
    //             display: true,
    //             fontSize: 22,
    //             fontColor: 'rgb(231, 245, 255)',
    //             lineHeight: 1,
    //             padding: 0
    //         },

    //         scales: {
    //             yAxes: [{ ticks: { beginAtZero: true } }]
    //         }

    //     }
    // });
    // TEMPERATURE ON STATION AND DAY 4
    // var bluered2 = ctx4.createLinearGradient(0, 100, 0, 200); // x0,y0,x1,y1
    // bluered2.addColorStop(0, "#ff3300");
    // bluered2.addColorStop(0.2, "#009999");
    // bluered2.addColorStop(1, "#00ddff");


    // var blueredBG2 = ctx4.createLinearGradient(0, 95, 0, 180); // x0,y0,x1,y1
    // blueredBG2.addColorStop(0, "rgb(255,64,0,0.1)");
    // blueredBG2.addColorStop(0.3, "rgb(0,160,160,0.1)");
    // blueredBG2.addColorStop(1, "rgb(0,220,255,0.1)");

    // var chart4 = new Chart(ctx4, {
    //     // The type of chart we want to create
    //     type: 'line',

    //     // The data for our dataset
    //     data: {
    //         labels: _labels2,
    //         datasets: [
    //             {
    //                 label: 'Température(°C)',
    //                 backgroundColor: blueredBG2,
    //                 borderColor: bluered2,
    //                 data: data4, //
    //                 borderWidth: '5'

    //             }]
    //     },

    //     // Configuration options go here
    //     options: {

    //         legend: { labels: { fontColor: 'rgb(231, 245, 255)', fontSize: 15 } },
    //         title: {
    //             display: false,
    //             fontSize: 16,
    //             fontColor: 'rgb(231, 245, 255)',
    //             lineHeight: 1,
    //             padding: 0
    //         },

    //         scales: {
    //             yAxes: [{ ticks: { beginAtZero: false } }],
    //             xAxes: [{
    //                 ticks: {
    //                     //min: '0',
    //                     //legend:'jrs'
    //                 }
    //             }]

    //         }

    //     }
    // });

}  