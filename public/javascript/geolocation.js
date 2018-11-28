'use strict';

const main = () => {
  const geolocationFeedback = document.getElementById('demo');
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      geolocationFeedback.innerHTML = 'Geolocation is not supported by this browser.';
    }
  };

  const showPosition = (position) => {
    givePosition(position);
  };

  const showError = (error) => {
    switch (error.code) {
    case error.PERMISSION_DENIED:
      geolocationFeedback.innerHTML = 'User denied the request for Geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      geolocationFeedback.innerHTML = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      geolocationFeedback.innerHTML = 'The request to get user location timed out.';
      break;
    case error.UNKNOWN_ERROR:
      geolocationFeedback.innerHTML = 'An unknown error occurred.';
      break;
    }
  };

  getLocation();

  const givePosition = (position) => {
    const longitude = document.querySelector('.longitude');
    longitude.value = position.coords.longitude;
    const latitude = document.querySelector('.latitude');
    latitude.value = position.coords.latitude;
  };
};

window.addEventListener('load', main);
