// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

let map: google.maps.Map, heatmap: google.maps.visualization.HeatmapLayer;
let planesByFlag: Object = {};
let countryCodes: Array<any>;
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


function initMap(): void {
  console.log("Archibaldo Eduardo2");
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
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




function getPoints(specialFlag: String = null): void {
  let url: String;
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

const createHeatmap = (data): void => {
  let points: google.maps.LatLng[] = [];
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
  }
}

const updatePlanesSelect = (): void => {
  let flags = Object.keys(planesByFlag);
  flags.sort((flag_a, flag_b) => planesByFlag[flag_b] - planesByFlag[flag_a]);

  // fetch('https://airlabs.co/api/v9/countries?api_key=b2b4091f-292e-4cb2-b92c-005161695af3')
  //   .then(response => response.json())
  //   .then(data => {
  //     let countriesCodes: Array<any> = data.response;
  //     for (const flagCode of flags) {
  //       let country = countriesCodes.filter(country => country.code == flagCode)[0];

  //       if (country) {
  //         flagsSelect.appendChild(new Option(`${country.name} - ${planesByFlag[flagCode]}`, flagCode));
  //       } else {
  //         flagsSelect.appendChild(new Option(`${flagCode} - ${planesByFlag[flagCode]}`, flagCode));
  //       }
  //     }
  //   })
  //   .catch(e => {
  //     console.log(e);
  //   })

  for (const flagCode of flags) {
    let country = countryCodes.filter(country => country.code == flagCode)[0];

    if (country) {
      flagsSelect.appendChild(new Option(`${country.name} - ${planesByFlag[flagCode]}`, flagCode));
    } else {
      flagsSelect.appendChild(new Option(`${flagCode} - ${planesByFlag[flagCode]}`, flagCode));
    }
  }

}

// TODO: Fix UK and GB


flagsSelect.addEventListener('change', (event) => {
  let select = event.target as HTMLSelectElement;
  getPoints(select.value);
})



window.initMap = initMap;


const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {}
};


window.addEventListener('DOMContentLoaded', () => {
  const myChart = new Chart(
    document.getElementById('planeByCountriesChart') as HTMLCanvasElement,
    config
  );
})




