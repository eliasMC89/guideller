'use strict';

function index () {
  const buttonsFavourites = document.querySelectorAll('.favourite-btn');
  buttonsFavourites.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const activityId = event.currentTarget.attributes.activity.value;
      axios.post(`/favourites/addDeleteFavourite/${activityId}`)
        .then((result) => {
          // console.log(result.data.status);
          // ahora con dom manipulation hay que mirar el status y hacer un toggle de la class para que te ponga una cosa u otra
          if (result.data.status === 'Added') {
            button.classList.add('yellow-star');
          } else if (result.data.status === 'Deleted') {
            button.classList.remove('yellow-star');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
};

window.addEventListener('load', index);
