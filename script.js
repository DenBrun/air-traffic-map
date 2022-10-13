// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

let map, heatmap;
let planesByFlag = {};
let countryCodes;
let chart;
Chart.defaults.font.size = 14;

const flagsSelect = document.getElementById('select-planes');
let gradient = [
    "rgba(142, 114, 194, 0.1)",
    "rgba(58, 28, 113, 1)",
    "rgba(58, 28, 113, 1)",
    "rgba(58, 28, 113, 1)",
    "rgba(58, 28, 113, 1)",
    "rgba(58, 28, 113, 1)",
    "rgba(77, 28, 169, 1)",
    "rgba(194, 26, 220, 1)",
    "rgba(194, 26, 220, 1)",
    "rgba(194, 26, 220, 1)",
    "rgba(216, 74, 88, 1)",
    "rgba(216, 74, 88, 1)",
    "rgba(216, 74, 88, 1)",
    "rgba(216, 74, 88, 1)",
    "rgba(223, 25, 25, 1)",
    "rgba(223, 25, 25, 1)",

];

// setTimeout(() => {
// fetch('./data/country-codes.json')
//   .then((response) => response.json())
//   .then((json) => countryCodes = json);
// }, 2000)



fetch('./data/country-codes.json')
    .then((response) => response.json())
    .then((json) => countryCodes = json);


function initMap() {
    console.log("Archibaldo Eduardo2");
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3.1,
        center: { lat: 33.749374, lng: -26.451329 },
        mapId: "abdf9465a5f0e4c7",
    });

    map.addListener("maptypeid_changed", () => {
        if (map.getMapTypeId() !== "roadmap") {
            heatmap.set("gradient", null);
        } else {
            heatmap.set("gradient", gradient);
        }
    })


    getPoints();
    console.log(planesByFlag);

}




function getPoints(specialFlag = null) {
    let url;
    if (specialFlag && specialFlag != 'all') {
        url = `https://airlabs.co/api/v9/flights?api_key=b2b4091f-292e-4cb2-b92c-005161695af3&flag=${specialFlag}`;
    } else {
        url = "https://airlabs.co/api/v9/flights?api_key=b2b4091f-292e-4cb2-b92c-005161695af3";
    }


    fetch(url.toString())
        .then(response => response.json())
        .then(data => {
            createHeatmap(data);
        })
        .catch(e => {
            console.log(e);
        })
}

const createHeatmap = (data) => {
    let points = [];
    for (const plane of data.response) {
        points.push(new google.maps.LatLng(plane.lat, plane.lng));
        if (plane.flag) {
            if (plane.flag == "UK" || plane.flag == "GB") {
                plane.flag = "GB&flag=UK"
            }
            if (plane.flag in planesByFlag) {
                planesByFlag[plane.flag] += 1;
            } else {
                planesByFlag[plane.flag] = 1;
            }
        }
    }

    if (heatmap) {
        heatmap.setData(points);
    } else {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: points,
            map: map,
            radius: 12,
            gradient: gradient
        });
        updatePlanesSelect();
        loadChart();
    }
}

const updatePlanesSelect = () => {
    let flags = Object.keys(planesByFlag);
    flags.sort((flag_a, flag_b) => planesByFlag[flag_b] - planesByFlag[flag_a]);

    for (const flagCode of flags) {
        let country = countryCodes.filter(country => country.code == flagCode)[0];

        if (country) {
            flagsSelect.appendChild(new Option(`${country.name} - ${planesByFlag[flagCode]}`, flagCode));
        } else {
            flagsSelect.appendChild(new Option(`${flagCode} - ${planesByFlag[flagCode]}`, flagCode));
        }
    }

}




flagsSelect.addEventListener('change', (event) => {
    let select = event.target;
    getPoints(select.value);
})



window.initMap = initMap;


const loadChart = () => {

    let width = window.screen.width;
    let showOptions = 7;

    if (width <= 768) {
        showOptions = 6;
    }

    let allFlags = Object.keys(planesByFlag);
    allFlags.sort((flag_a, flag_b) => planesByFlag[flag_b] - planesByFlag[flag_a]);
    const flags = allFlags.slice(0, showOptions);

    let labels = flags.map(flagCode => countryCodes.filter(country => country.code == flagCode)[0].name);
    let planeNnumbers = flags.map(flagCode => planesByFlag[flagCode])

    const data = {
        labels: labels,
        datasets: [{
            axis: 'y',
            label: 'Planes by the flag',
            backgroundColor: 'rgba(66, 25, 148, 1)',
            data: planeNnumbers,
            inflateAmount: -3,
            borderRadius: 3,
            hoverBackgroundColor: 'rgba(109, 56, 214, 0.8)'

        }]
    };

    const config = {
        type: 'bar',
        data: data,
        plugins: [ChartDeferred],
        options: {
            indexAxis: 'y',
            plugins: {
                deferred: {
                    xOffset: 150,   // defer until 150px of the canvas width are inside the viewport
                    yOffset: '50%', // defer until 50% of the canvas height are inside the viewport
                    // delay: 0      // delay of 500 ms after the canvas is considered inside the viewport
                }
            },
            transitions: {
                show: {
                    animations: {
                        x: {
                            from: 0
                        }
                    }
                },
                hide: {
                    animations: {
                        x: {
                            to: 0
                        },
                    }
                },
                // resize: {
                //     animations: {
                //         x: {
                //             from: 0
                //         }
                //     }
                // }
            },
            animations: {
                y: { duration: 0 }
            },

        }
    };

    // if (chart) chart.destroy();

    chart = new Chart(
        document.getElementById('planeByCountriesChart'),
        config
    );
}

const updateLegend = () => {
    let width = window.innerWidth;
    // console.log(width);
    let showOptions = 7;

    if (width <= 672) {
        showOptions = 5;
    }
    else if (width <= 768) {
        showOptions = 6;
    }

    let allFlags = Object.keys(planesByFlag);
    allFlags.sort((flag_a, flag_b) => planesByFlag[flag_b] - planesByFlag[flag_a]);
    const flags = allFlags.slice(0, showOptions);

    let labels = flags.map(flagCode => countryCodes.filter(country => country.code == flagCode)[0].name);
    let planeNnumbers = flags.map(flagCode => planesByFlag[flagCode])

    chart.data.datasets.data = planeNnumbers;
    chart.data.labels = labels;
    chart.update();
}




window.addEventListener('resize', updateLegend);