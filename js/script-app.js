// Functions to add and remove loader
function showLoader() {
    document.getElementById("loader").classList.add('show');
}
function hideLoader() {
    document.getElementById("loader").classList.remove('show');
}

// Variables  /////////////////////////////////////////////////////////////////////////
var map = L.map("map").setView([17.38000, 78.49000], 12)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 11,
    attribution: '© OpenStreetMap'
}).addTo(map);

const url = 'https://6fd0-34-134-223-133.ngrok-free.app'

var g_images = [] // Array of all image urls
var g_img_overlay = L.imageOverlay(); // List of the image overlays
var g_kpi_overlay = L.imageOverlay(); // List of the kpi overlays
var g_bounds = []; // Get the bounds of the map
var g_markers_list = []; // List of the markers 
var coordinates = []
var g_days = []
var g_kpi; // KPI to be used
var count = 1;

const kpis = document.querySelectorAll('[name="kpi"]')

map.createPane('imagePane');
map.getPane('imagePane').style.zIndex = 401;

map.createPane('KPIimagePane');
map.getPane('KPIimagePane').style.zIndex = 403;

// Set to current location /////////////////////////////////////////////////////////
var lc = L.control.locate({
    position: "topleft",
    keepCurrentZoomLevel: true,
    drawCircle: false,
    strings: {
        title: "Your Location"
    }
}).addTo(map);

// Add search to map ///////////////////////////////////////////////////
var geocoder = L.Control.geocoder({
    position: 'topleft',
    defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
    ]);
    map.fitBounds(poly.getBounds());
}).addTo(map);

// Search with coordinates ////////////////////////////////////////////
document.getElementById('coords').onsubmit = e => {
    e.preventDefault()
    const lat = document.getElementById('lat').value
    const long = document.getElementById('long').value
    map.setView([lat, long])
}

// Adding Draw controls to map /////////////////////////////////////////////////////////////////////////
var drawn_items = new L.FeatureGroup();
map.addLayer(drawn_items);
var drawn_markers = new L.FeatureGroup();
map.addLayer(drawn_markers);
     
var draw_control = new L.Control.Draw({
    position: 'topright',
    draw: {
        polyline: false,
        circle: false,
        polygon:{
            shapeOptions:{
                fillOpacity: 0,
                color:'red'
            }
        },
        rectangle:{
            shapeOptions:{
                fillOpacity: 0,
                color:'purple',
                zIndex: 402
            }
        },
        marker:false
    },
    edit: {
        featureGroup: drawn_items,
        // edit: false
    }
});
var marker_control = new L.Control.Draw({
    position: 'topright',
    draw: {
        polyline: false,
        circle: false,
        polygon: false,
        rectangle:false,
    },
    edit: {
        featureGroup: drawn_markers,
        // edit: false
    }
});

map.addControl(draw_control);
map.addControl(marker_control);

// Function to run if there is error ///////////////////////////////////////////
function failedToLoad() {
    alert("Something Went Wrong")
    hideLoader()
}

// Selecting Dates /////////////////////////////////////////////////////////////
// Changing the dates on page
function updateDates() {
    document.getElementById('days').innerHTML = '<legend>Days</legend>'
    for(let i = 0; i < 5; i++){
        document.getElementById('days').innerHTML += `<div> <input type="radio" id="${i}" name="day"><label for="${i}">${g_days[i].slice(11, 21)}</label> </div>`
    }
}
// Changing the global array of days /////////////////////////////////
function selectDates(day) {
    g_days = []
    var start = new Date(day)
    var end = new Date(day.setDate(day.getDate() - 25)).toJSON().slice(0, 10)
    for(let i = 0; i < 5; i++){
        var entry = end + '/' + start.toJSON().slice(0, 10);
        g_days.push(entry);
        start.setDate(start.getDate() - 5);
    }
    // console.log(g_days)
    updateDates()
}

const date = document.getElementById('dates');
date.valueAsDate = new Date();
selectDates(new Date())

// Function to run when date is selected
date.onchange = function() {
    if(this.valueAsDate > new Date){
        this.valueAsDate = new Date();
        alert("Can't have a Date in future")
    }
    selectDates(this.valueAsDate)
}

// Functions to do when getting visual image ////////////////////////////////////////////////////
// Function to send the 5 api calls
async function setVisualImages() {
    g_images = []
    for (let i = 0; i < g_days.length; i++){
        if(i === 0) {
            showLoader()
            await getVisualImageOverlay(g_days[i], true)
            // console.log(g_images[0])
        } else{
            await getVisualImageOverlay(g_days[i], false)
        }
    }
}
// Function to get image and create overlay
async function getVisualImageOverlay(date, add) {
    var options =  {
        method: 'post',
        body: JSON.stringify({"bbox": g_bounds,"time_of_interest": date}),
        headers:{
            // 'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json'
        }
    }
    var res = await fetch("https://picsum.photos/500/500") // For Testing
    // var res = await fetch(`${url}/visual-image/`, options).catch(failedToLoad()) // Actual line
    var img_data = await res.blob();
  
    if (400 <= res.status && res.status <= 599) {
        alert(`Error ${res.status}: Failed fetching visual data`);
        hideLoader()
        return null;
    }
  
    const fr = new FileReader();
    fr.readAsDataURL(img_data);
    fr.addEventListener('load', () => {
        if (add){
            g_img_overlay = L.imageOverlay(fr.result, [ [g_bounds[1],g_bounds[2]],[g_bounds[0],g_bounds[3]] ], {pane: 'imagePane'}).addTo(map);
            datesElement[0].checked = true // Indicating the date that is checked
            // Adding the checkbox to toggle the image
            document.getElementById('visual-checkbox').style.display = 'block';
            document.getElementById('visual-checkbox').checked = true
            hideLoader()
        }
        g_images.push(fr.result)
    });
}

document.getElementById('btn-visual').onclick = function(){
    g_bounds = [map.getBounds().getSouth(), map.getBounds().getNorth(), map.getBounds().getWest(), map.getBounds().getEast()];
    
    map.zoomOut();
    
    setVisualImages()
};

// Changing the vissual image ////////////////////
const datesElement = document.querySelectorAll('input[name = "day"]')
document.getElementById('days').onclick = () => {
    datesElement.forEach(date => {
        // console.log(date, date.checked)
        if(date.checked == true){
            // console.log(date)
            map.removeLayer(g_img_overlay)
            g_img_overlay = L.imageOverlay(g_images[date.id], [ [g_bounds[1],g_bounds[2]],[g_bounds[0],g_bounds[3]] ], {pane: 'imagePane'}).addTo(map);
            document.getElementById('visual-checkbox').checked = true
            // console.log(date.id)
        }
    })
}

// Visual image toggle /////////////////////////////////
document.getElementById('visual-checkbox').onclick = () => {
    if (document.getElementById('visual-checkbox').checked) {
        map.addLayer(g_img_overlay);
    } else {
        map.removeLayer(g_img_overlay);
    }
}

// Functions to do when getting KPI image ////////////////////////////////////////////////////
// Selecting KPI 
document.getElementById('kpi').onclick = function() {
    kpis.forEach(option => {
        if (option.checked == true){
            g_kpi = option.id;
            // console.log(g_kpi)
        }
    })
}

// Getting the KPI image
async function getKpiImage(bounds, date) {
    showLoader()
    var options =  {
        method: 'post',
        body: JSON.stringify({"bbox": g_bounds,"time_of_interest": date, "kpi": g_kpi, "phase_list": coordinates}),
        headers:{
        //   'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
    }
    // console.log(JSON.stringify({"bbox": g_bounds,"time_of_interest": date, "kpi": g_kpi, "phase_list": coordinates}))

    var res = await fetch("https://picsum.photos/500/500") // For Testing
    // var res = await fetch(`${url}/kpi-image/`, options).catch(failedToLoad()) // Actual line
    var img_data = await res.blob();

    if (400 <= res.status && res.status <= 599) {
        hideLoader()
        alert(`Error ${res.status}: Failed fetching KPI data`);
        return null;
    }
    
    const fr = new FileReader();
    fr.readAsDataURL(img_data);
    fr.addEventListener('load', ()=> {
        g_kpi_overlay = L.imageOverlay(fr.result, [ [bounds[1],bounds[2]],[bounds[0],bounds[3]] ], {pane: 'KPIimagePane'}).addTo(map);
        hideLoader();
        document.getElementById('kpi-checkbox').style.display = 'block';
        document.getElementById('kpi-checkbox').checked = true;
    });
}
// function run on the button click
document.getElementById('btn-kpi').onclick = function(){
    var bbox

    drawn_items.eachLayer(layer => {
        bbox = [layer.getBounds().getSouth(), layer.getBounds().getNorth(), layer.getBounds().getWest(), layer.getBounds().getEast()];
        coordinates.push(pre_process_array(layer.toGeoJSON().geometry.coordinates[0]))
        // console.log(bbox)
        // console.log(coordinates)
    });
    
    if(!bbox){
        alert('Please select area on map')
    }
    else if(g_kpi) {
        getKpiImage(bbox, g_days[0])
    } else {
        alert("Please select a valid KPI")
    }
    
};

// KPI image toggle /////////////////////////////////
document.getElementById('kpi-checkbox').onclick = () => {
    if (document.getElementById('kpi-checkbox').checked) {
        map.addLayer(g_kpi_overlay);
    } else {
        map.removeLayer(g_kpi_overlay);
    }
}


// Drawing polygons and markers //////////////////////////////////////////////////////////////////
map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;
        
    if (type === 'marker') {
        layer.title = `Point ${count}`
        let coord = layer.toGeoJSON().geometry.coordinates;
        layer.bindPopup(`${layer.title} <br> ${coord[1]}, ${coord[0]}` )
        count++
        drawn_markers.addLayer(layer);
    }
    else{
        let coord = pre_process_array(layer.toGeoJSON().geometry.coordinates[0])
        let popup_content = 'Polygon coordinates: <br>'
        for (let i in coord){
            popup_content += `${coord[i][1]}, ${coord[i][0]} <br>`
        }
        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs());
        // popup_content += `Area: ${area}`
        layer.bindPopup(popup_content).openPopup();
        drawn_items.addLayer(layer);
    }
    // console.log(coordinates)
  
});

function pre_process_array(input) {
    var output = []
    if (input.length == 5){
        output = input.slice(1, input.length);
    }else{
        for (var i = 1; i < input.length; i+=2){
            output.push(input[i]);
        }
    }
    return output;
}

// Getting marker data to send ///////////////////////////////////////////////////
async function sendData(){
    showLoader()
    var options =  {
        method: 'post',
        body: JSON.stringify({"bbox": g_bounds,"time_of_interest": g_days[0], "kpi": g_kpi, "past_data_points": 5, "pixel_list": g_markers_list}),
        headers:{
            // 'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json'
        }
    }
    // console.log(JSON.stringify({"bbox": g_bounds,"time_of_interest": g_days[0], "kpi": g_kpi, "past_data_points": 5, "pixel_list": g_markers_list}))
    
    // var res = await fetch(`${url}/kpi-image/`, options).catch(failedToLoad())
    var data = await res.json();

    if (400 <= res.status && res.status <= 599) {
        hideLoader()
        alert(`Error ${res.status}: Failed fetching data`);
        return null;
    }
    
    var data_set = []
    var pts = []
    const color = ['red', 'blue', 'green', 'yellow', 'orange', 'brown']

    for (let key in data){
        // console.log(data[key][g_days[0]]);
        var value = []
        for (let i in g_days){
            value.push(data[key][g_days[i]])
        }
        data_set.push(value)
        pts.push(key)
    }

    var datasets = []
    for (let i in pts){
        datasets.push({data: data_set[i], borderColor: color[i], label: pts[i], fill: false});
    }

    createGraph(datasets);
}

// Creating Graphs
function createGraph(yData) {
    new Chart("chart", {
        type: "line",
        data: {
            labels: g_days,
            datasets: yData
        }
    });
    hideLoader()
}

document.getElementById('btn-data').onclick = function() {
    drawn_markers.eachLayer(layer => {
        g_markers_list.push({'title': layer.title, 'Coords': layer.toGeoJSON().geometry.coordinates})
    })
    // console.log(g_markers_list == [])

    if(g_markers_list.length == 0){
        alert('Please add some markers first')
    }
    else {
        // sendData()
    }
    // console.log(JSON.stringify({"bbox": g_bounds, "time_of_interest": g_days[0], "kpi": g_kpi, "past_data_points": 5, "pixel_list": g_markers_list}))
}
