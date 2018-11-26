'use strict';

function main () {
  var activitiesSectionElement = document.querySelector('.activities-list');
  var tripsSectionElement = document.querySelector('.trips-list');
  var buttonActivities = document.querySelector('.triangle-act');
  var buttonTrips = document.querySelector('.triangle-trip');

  var hideActivities = function (event) {
    event.stopPropagation();
    activitiesSectionElement.classList.toggle('hidden');
    if (activitiesSectionElement.classList.contains('hidden')) {
      buttonActivities.innerText = 'Show';
    } else {
      buttonActivities.innerText = 'Hide';
    }
  };

  buttonActivities.addEventListener('click', hideActivities);

  var hideTrips = function (event) {
    event.stopPropagation();
    tripsSectionElement.classList.toggle('hidden');
    if (tripsSectionElement.classList.contains('hidden')) {
      buttonTrips.innerText = 'Show';
    } else {
      buttonTrips.innerText = 'Hide';
    }
  };

  buttonTrips.addEventListener('click', hideTrips);
}
window.addEventListener('load', main);
