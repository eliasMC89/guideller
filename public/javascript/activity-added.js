'use strict';

function index () {
  const buttonsTrip = document.querySelectorAll('.btn-trip');
  buttonsTrip.forEach((button) => {
    button.addEventListener('click', (event) => {
      console.log('clicked');
      event.preventDefault();
      const activityId = event.currentTarget.attributes.activity.value;
      const tripId = event.currentTarget.attributes.trip.value;
      axios.post(`/trips/${tripId}/add-delete-this/${activityId}`)
        .then((result) => {
          if (result.data.status === 'Added') {
            button.innerText = 'Remove';
          } else if (result.data.status === 'Deleted') {
            button.innerText = 'Add';
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
};

window.addEventListener('load', index);
