'use strict';

function main () {
  const activitiesSectionElement = document.querySelector('.activities-list');
  const tripsSectionElement = document.querySelector('.trips-list');
  const favsSectionElement = document.querySelector('.favs-list');
  const buttonActivities = document.querySelector('.triangle-act');
  const buttonTrips = document.querySelector('.triangle-trip');
  const buttonFavs = document.querySelector('.triangle-fav');

  const hideActivities = function (event) {
    event.stopPropagation();
    activitiesSectionElement.classList.toggle('hidden');
    if (activitiesSectionElement.classList.contains('hidden')) {
      buttonActivities.innerText = 'Show';
    } else {
      buttonActivities.innerText = 'Hide';
    }
  };

  buttonActivities.addEventListener('click', hideActivities);

  const hideTrips = function (event) {
    event.stopPropagation();
    tripsSectionElement.classList.toggle('hidden');
    if (tripsSectionElement.classList.contains('hidden')) {
      buttonTrips.innerText = 'Show';
    } else {
      buttonTrips.innerText = 'Hide';
    }
  };

  buttonTrips.addEventListener('click', hideTrips);

  const hideFavs = function (event) {
    event.stopPropagation();
    favsSectionElement.classList.toggle('hidden');
    if (favsSectionElement.classList.contains('hidden')) {
      buttonFavs.innerText = 'Show';
    } else {
      buttonFavs.innerText = 'Hide';
    }
  };

  buttonFavs.addEventListener('click', hideFavs);
}
window.addEventListener('load', main);
