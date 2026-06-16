// LES CHARTS EN JS
var datachart = d3.json("meteo.json")
.then(drawChart).catch(console.error);

// les datas pour le jour la station les heures
var data3 = [];
var data4 = [];
var _labels2 = []; // labels heures
var cityName = '...';

function drawChart(datach){



var data1 = [];
var data2  = [];
var _labels = []; // labels
var labelsCut = []; // lables découpés
    



// push des jours dans les labels (absysses)
for(let d of datach){
        _labels.push(d);
        
}  


///// ALGO DE DECOUPE DES LABELS
var fourchette = getFourch();


function getFourch(){


    
    var nombre;
    var tailleLabels = _labels.length;
    //alert('longueur labels: '+ _labels.length);
    var message = ""; // Message à afficher, initialement vide
        //alert(tailleLabels);    
        if (tailleLabels % 3 === 0) {
            // tailleLabels divisible par 3 : on ajoute au message
            message += tailleLabels +  ' divisible par 3, ';
            nombre = 3;
        }
        if (tailleLabels % 4 === 0) {
            // tailleLabels divisible par 4 : on ajoute au message
            message += tailleLabels + ' divis par 4, ';
            nombre = 4;
        }
        if (tailleLabels % 5 === 0) {
            // tailleLabels divisible par 5 : on ajoute au message
            message += tailleLabels + ' divis par 5, ';
            nombre = 5;
        }
        if (message === "") {
            // Si message est vide, le tailleLabels n'est divisible ni par 3, ni par 5 :
            // le message affiché sera le tailleLabels
            message += tailleLabels +  " divisible ni par 3 ni 4 ni 5 !!";
            nombre = 1;
        }
    //console.log(message);

    return nombre;
}



for(let d of _labels){
        
        if(d.d % fourchette && d.d != 1){ // si le jour n'est pas divisible par la fourchette et par 1
            
            continue;
        }
        else{
            data1.push(d.p); // push des données
            data2.push(Math.round(d.t / 100)); // push des données
            labelsCut.push(d.d); // push des labels découpés
        }    

}  


    ///// FIN ALGO 





Chart.defaults.global.title.display = false;
Chart.defaults.global.title.text = ["' Évolution pour toute la france sur "+ datach.length +" jours '"];

var ctx = document.getElementById('myChart').getContext('2d');
var ctx2 = document.getElementById('myChart2').getContext('2d');

// PLUVIOMETER
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: labelsCut,
        datasets: [{
            label: 'Pluie(mm)',
            backgroundColor: 'rgb(35, 128, 255, 0.1)',
            borderColor: 'rgb(0, 160, 255)',
            data: data1,//
            borderWidth: '5'
        }]
    },

    // Configuration options go here
    options: {
        
        legend:{labels:{fontColor:'rgb(231, 245, 255)',fontSize:15}},
        title:{
            display: true,
            fontSize: 21,
            fontColor: 'rgb(231, 245, 255)',
            padding: 0
        },

        scales: {yAxes: [{ticks: {beginAtZero: false}}]
    }
    
    }
}
);
// TEMPERATURE
var bluered = ctx.createLinearGradient(0, 125, 0, 245); // x0,y0,x1,y1
    bluered.addColorStop(0, "#ff3300");
    bluered.addColorStop(0.2, "#009999");
    bluered.addColorStop(1, "#00ddff");

    
var blueredBG = ctx.createLinearGradient(0, 125, 0, 245); // x0,y0,x1,y1
    blueredBG.addColorStop(0, "rgb(255,64,0,0.1)");
    blueredBG.addColorStop(0.2, "rgb(0,160,160,0.1)");
    blueredBG.addColorStop(1, "rgb(0,220,255,0.1)");

var chart2 = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: labelsCut,
        datasets: [
        {
            label: 'Température(°C)',
            backgroundColor: blueredBG,
            borderColor: bluered,
            data: data2, //
            borderWidth: '5'
            
        }]
    },

    // Configuration options go here
    options: {
        
        legend:{labels:{fontColor:'rgb(231, 245, 255)',fontSize:15}},
        title:{
            display: false,
            fontSize: 16,
            fontColor: 'rgb(231, 245, 255)',
            lineHeight: 0.8,
            padding: 0
        },

        scales: {yAxes: [{ticks: {beginAtZero: false}}]
    }
    
    }
});



var valueoption = 0;

const monselect = d3.select("#myStationSelected");

monselect
.append("option")
.text("Aucune") // option par defaut
.attr("value", function(d) {
    return 'Aucune';
})
.attr("selected", true);

let options = monselect.selectAll().data(datach[day].station)
.enter()
.append("option")
.text(function(d) {
    return d.n;
})
.attr("value", function(d) {
    return valueoption++;
})
.on('click', function(sta){
    
    let id = this.getAttribute("value"); // id du myStationSelected                
    let _station = datach[day].station; // on récupère la station en fonction du jour
                                        // pas d'autre moyen de le récupérer
                    
    pushDataChart3n4(_station, id); // push des datas ici, 
    // le selectDay appelle aussi cette fonction dans drawmap.js

    
    cityName = _station[id].n;
    document.getElementById("temps").innerHTML = 'Pluie: '+ Math.round(_station[id].p) + 'mm'; 
    /*_station[id].p > 10 ?
    'pluvieux' + _station[id].p : _station[id].p == 0 ? 
    'ensoleillé' + _station[id].p : _station[id].p > 0 ? 'nuageux' + _station[id].p : '';
    */
    document.getElementById("temperature").innerHTML = Math.round(_station[id].t/100) + '°C';
    document.getElementById("localisation").innerHTML = _station[id].n;
    

    updateChart();
})
;

updateChart();
}

// param: la station, l'id du selectStation
function pushDataChart3n4(une_station, id){
// nettoyage des anciennes données s'il y en a
    data3.splice(0, data3.length);
    data4.splice(0, data4.length);
    _labels2.splice(0, _labels2.length);
    data3.length = 0;
    data4.length = 0;
    _labels2.length = 0; // par sécurité

for(let hour of une_station[id].hours){
        // les données ne maj pas en fonction du jour, il faut aller piocher à partir de datach
        data3.push(Math.round(hour.p)); // push des données graphiques, pluie
        data4.push(Math.round(hour.t/100)); // temp°
        _labels2.push(hour.h);
}
    /*d.hours.forEach(hour => {
        
    });*/

}

function updateChart(){
// les 2 charts suivant se trouvent en bas de page
// PLUVIOMETTER ON STATION AND DAY 3

//console.log(data4);

Chart.defaults.global.title.text = [" Jour " + day,"' Pluie et Temperature à " + cityName + " '"];
    
var ctx3 = document.getElementById('myChart3').getContext('2d');
var ctx4 = document.getElementById('myChart4').getContext('2d');

var chart3 = new Chart(ctx3, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: _labels2,
        datasets: [
        {
            label: 'Pluie(mm)',
            backgroundColor: 'rgb(35, 128, 255, 0.1)',
            borderColor: 'rgb(0, 160, 255)',
            data: data3, //
            borderWidth: '5'
            
        }]
    },

    // Configuration options go here
    options: {
        
        legend:{labels:{fontColor:'rgb(231, 245, 255)',fontSize:15}},
        title:{
            display: true,
            fontSize: 22,
            fontColor: 'rgb(231, 245, 255)',
            lineHeight: 1,
            padding: 0
        },

        scales: {yAxes: [{ticks: {beginAtZero: true}}]
    }
    
    }
});
// TEMPERATURE ON STATION AND DAY 4
var bluered2 = ctx4.createLinearGradient(0, 100, 0, 200); // x0,y0,x1,y1
    bluered2.addColorStop(0, "#ff3300");
    bluered2.addColorStop(0.2, "#009999");
    bluered2.addColorStop(1, "#00ddff");

    
var blueredBG2 = ctx4.createLinearGradient(0, 95, 0, 180); // x0,y0,x1,y1
    blueredBG2.addColorStop(0, "rgb(255,64,0,0.1)");
    blueredBG2.addColorStop(0.3, "rgb(0,160,160,0.1)");
    blueredBG2.addColorStop(1, "rgb(0,220,255,0.1)");

var chart4 = new Chart(ctx4, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: _labels2,
        datasets: [
        {
            label: 'Température(°C)',
            backgroundColor: blueredBG2,
            borderColor: bluered2,
            data: data4, //
            borderWidth: '5'
            
        }]
    },

    // Configuration options go here
    options: {
        
        legend:{labels:{fontColor:'rgb(231, 245, 255)',fontSize:15}},
        title:{
            display: false,
            fontSize: 16,
            fontColor: 'rgb(231, 245, 255)',
            lineHeight: 1,
            padding: 0
        },

        scales:{
            yAxes: [{ticks: {beginAtZero: false}}],
            xAxes: [{
                ticks: {
                    //min: '0',
                    //legend:'jrs'
                }
            }]

        }
    
    }
});

}  

