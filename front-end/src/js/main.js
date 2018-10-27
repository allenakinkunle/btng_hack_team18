let map;

let examplePollingUnits = [
  {
    lngLat: { lng: 3.356800, lat: 6.548650 },
    status: "violence",
    pollingUnitName: '4, adeyinka st.',
    ward: 'Ilupeju Industrial Estate',
    LGA: 'Mushin',
    state: 'Lagos',
    reports: [
      {
        status: 'violence',
        date: 1540656623247,
        message: 'This is my message'
      },
      {
        status: 'safe',
        date: 1540656623247,
        message: 'Another message'
      },
      {
        status: 'safe',
        date: 1540656623247,
        message: 'The third message'
      }
    ]
  },
  {
    lngLat: { lng: 8.967950, lat: 11.991020 },
    status: "safe",
    pollingUnitName: 'Amaeke Umuehihie Village Square',
    ward: 'Uzoagba',
    LGA: 'Ikeduru',
    state: 'Imo',
    reports: [
      {
        status: 'violence',
        date: 1540656623247,
        message: 'This is my message'
      }
    ]
  },
  {
    lngLat: { lng: 6.908873275938959, lat: 10.05200237837603 },
    status: "rigging",
    pollingUnitName: 'yankintaj / banago, yankintaps',
    ward: 'Chula',
    LGA: 'Ajingi',
    state: 'Kano',
    reports: [
      {
        status: 'violence',
        date: 1540656623247,
        message: 'This is my message'
      }
    ]
  },
  {
    lngLat: { lng: 6.762100, lat: 8.014110 },
    status: "safe",
    pollingUnitName: 'ebwa area open space, ebwa',
    ward: 'Kupa North East',
    LGA: 'Lokoja',
    state: 'Kogi',
    reports: [
      {
        status: 'violence',
        date: 1540656623247,
        message: 'This is my message'
      }
    ]
  },
  {
    lngLat: { lng: 7.677060, lat: 5.592410 },
    status: "violence",
    pollingUnitName: '59 alakas compound',
    ward: 'Olusokun',
    LGA: 'Ede North',
    state: 'Osun',
    reports: [
      {
        status: 'violence',
        date: 1540656623247,
        message: 'This is my message'
      }
    ]
  }
];

let dateToTime = (date) => {
  var d = new Date(date).toUTCString();
  
  return d.slice(-12, -4);
}

let getPopupHtml = (unit) => {
  let html = `<h2>${unit.pollingUnitName}</h2>
  <div>
    <label>Ward:</label>
    <h4>${unit.ward}</h4>
  </div>
  
  <div>
    <label>LGA:</label>
    <h4>${unit.LGA}</h4>
  </div>
  
  <div>
    <label>State:</label>
    <h4>${unit.state}</h4>
  </div>
  
  <div class="reports">
    <h4>Reports:</h4>
    <ul>`

  unit.reports.forEach((r) => {
    html += `<li>
      <span class="indicator" style="background-color: ${getStatusColor(r.status)};"></span>
      <span class="time">${dateToTime(r.date)}</span>
      <span class="message">"${r.message}"</span>
    </li>`;
  });

  html += `</ul></div>`;

  return html;
}

let getReportHtml = (r) => {
  return `<li class="report-item">
  <h3 class="unit-name">${r.name}</h3>
  <span class="indicator">${getStatusColor(r.status)}</span>
  <span class="status">${r.status}</span>
  <span class="date">${dateToTime(r.date)}</span>
  <p class="message">${r.message}</p>
</li>`
}

let getStatusColor = (status) => {
  if (status === "violence") {
    return '#e03';
  } else if (status === "safe") {
    return '#0d3'
  } else if (status === "rigging") {
    return '#f90'
  }
}

let addUnit = (unit) => {
  let popup = new mapboxgl.Popup({})
    .setHTML(getPopupHtml(unit));

  new mapboxgl.Marker({ color: getStatusColor(unit.status) })
    .setLngLat(unit.lngLat)
    .setPopup(popup)
    .addTo(map);
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content ready.");

  let nigeriaBounds = new mapboxgl.LngLatBounds([0.5561044810595206, 0.8025002703637654], [16.006104475348423, 18.152908157846937]);

  mapboxgl.accessToken = 'pk.eyJ1IjoibTYtZDYiLCJhIjoiZG8ybU5udyJ9.GDHBtbCc_yP6RNZkd4i87A';
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: {lat: 9.250447477515095, lng: 8.41847386004406},
    maxBounds: nigeriaBounds,
    style: 'mapbox://styles/m6-d6/cjnrgnad61hph2rp9in8huamo'
  });

  map.on('load', () => {
    examplePollingUnits.forEach((pU) => {
      addUnit(pU);

      pU.reports.forEach((r) => {
        let li = document.createElement('li');
            li.innerHTML = `<h3 class="unit-name">${pU.pollingUnitName}</h3></br>
              <span class="indicator" style="background-color: ${getStatusColor(r.status)};"></span>
              <span class="status">${r.status}</span><span class="seperator">|</span>
              <span class="date">${dateToTime(r.date)}</span><span class="seperator">|</span>
              <span class="message">${r.message}</span>`

        document.querySelector('.reports-list').appendChild(li);
      });
    });

    document.querySelectorAll('.reports-list .unit-name').forEach((n) => {
      n.addEventListener('click', (e) => {
        // n.textContent
      });
    });
  });
});