const tableData = (ev) => {
  const properties = ev.target.feature.properties;
  map.fitBounds(ev.target.getBounds());;

  Swal.fire({
    position: 'bottom',
    showClass: {
      popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `,
    },
    hideClass: {
      popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `,
    },
    grow: 'row',
    showConfirmButton: false,
    showCloseButton: true,
    html: `
    <table style="font-family: arial, sans-serif;border-collapse: collapse;">
      <tr>
        <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Propertie</th>
        ${Object.keys(properties).map(prop => {
          return `<td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">${prop}</td>`;
        })}
        
      </tr>
      <tr>
        <th style="border: 1px solid #dddddd;text-align: left;padding: 8px;">Value</th>
        ${Object.keys(properties).map(prop => {
          return `<td style="border: 1px solid #dddddd;text-align: left;padding: 8px;">${properties[prop]}</td>`
        })}
      </tr>
    </table>
    `
  });
};

const highlightFeature = (e) => {
  var layer = e.target;

  layer.setStyle({
      fillColor: '#FFFAB7',
      weight: 2,
      color: '#FFEBB2',
      dashArray: '',
      fillOpacity: 0.7
  });

  layer.bringToFront();
};

const style = (feature) => {
  return {
      fillColor: 'blue',
      weight: 0.5,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.7
  };
}

let map = L.map("map", {
  center: [3.3754991952719178,-76.53344546616914],
  zoom: 17,
  minZoom: 17
});

L.maplibreGL({
  style: "http://uvmanos.gisfer.net:4321/mapa"
}).addTo(map);

map.createPane("osm");
map.getPane("osm").style.zIndex = -650;

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  pane: 'osm',
  maxZoom: 19
});

osm.addTo(map);

const pisos = [-1, 1, 2, 3, 4, 5, 6];

const controlLayers = L.control.layers();
controlLayers.addTo(map);

pisos.forEach((floor) => {
  fetch(`http://uvmanos.gisfer.net:4321/espacios?nivel=${floor}`)
  .then(res => res.json())
  .then(data => {
    try {
      let geoJsonLayer;
      geoJsonLayer = L.geoJSON(data, {
        onEachFeature: (feature, layer) => {
          layer.on({
            'click': tableData,
            'mouseover': highlightFeature,
            'mouseout': e => {
              geoJsonLayer.resetStyle(e.target);
            },
          });
        },
        style: style
      });

      controlLayers.addOverlay(geoJsonLayer, `Nivel ${floor}`)
    } catch (err) {
      console.log(err);
    };
  });
})