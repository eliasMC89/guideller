'use strict';

function index () {
  const addTripBtn = document.querySelectorAll('.trip-btn');
  addTripBtn.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const tripId = document.querySelectorAll('.add-trip-value').value;
      // const activityId = event.currentTarget.attributes.activityId.value;
      console.log(tripId);
      // console.log(activityId);
      // axios.post(`/trips/${tripId}/addActivity/${activityId}`);
    });
  });
}

window.addEventListener('load', index);
