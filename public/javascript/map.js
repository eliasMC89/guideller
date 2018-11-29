'use strict';

const main = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoianFiYWVuYSIsImEiOiJjam92YTEwZ3kwMzJqM3FwY3g2bzQ3OHV3In0.u-dT5_6jWWZQ7F8etEMzfA';
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [41.3948976, 2.0787281].reverse(),
    zoom: 12
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var pos = [position.coords.longitude, position.coords.latitude];
      // map.setCenter(pos);
      new mapboxgl.Marker()
        .setLngLat(pos)
        .addTo(map);
    }, () => {
      alert('Issue retrieving your location');
    });
  } else {
    alert(' Your browser doesn\'t support Geolocation');
  }

  const pAddress = document.querySelector('.activity-address');
  const address = pAddress.getAttribute('address');
  console.log(address);

  var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

  mapboxClient.geocoding.forwardGeocode({
    query: address,
    autocomplete: false,
    limit: 1
  }).send()
    .then(function (response) {
      if (response && response.body && response.body.features && response.body.features.length) {
        var feature = response.body.features[0];
        console.log(feature);
        map.setCenter(feature.center);
        new mapboxgl.Marker()
          .setLngLat(feature.center)
          .addTo(map);
      }
    });

  // axios.get(`/activities/${activitiesId}/details`)
  //   .then((result) => {
  //     result.data.forEach(restaurant => {

  //     });
  //   })
  //   .catch(err => console.error(err));
};

window.addEventListener('load', main);
