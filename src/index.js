import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { picturesSearch } from './search-api.js';
import { serviceMarkup } from './markup.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const guard = document.querySelector('.js-guard');
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const finalText = document.querySelector('.js-final-text');
let inputValue = '';
let currentPage = 1;
let totalPages = 0;
let totalHits = 0;
const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onFormSubmit);

const options = {
  root: null,
  rootMargin: '300px',
  // threashold: 0,
};
const observer = new IntersectionObserver(onLoadMore, options);

function onLoadMore(entries) {
  entries.forEach(entry => {
    console.log(entries);
    if (entry.isIntersecting) {
      currentPage += 1;
      picturesSearch(inputValue, currentPage).then(pictures => {
        totalHits = pictures.totalHits;
        totalPages = Math.ceil(totalHits / 40);
        gallery.insertAdjacentHTML('beforeend', serviceMarkup(pictures));
        lightbox.refresh();
        if (currentPage >= totalPages) {
          finalText.classList.replace('final-text-hidden', 'final-text');
        }
      });
    }
  });
}

function onFormSubmit(event) {
  finalText.classList.replace('final-text', 'final-text-hidden');
  currentPage = 1;
  gallery.innerHTML = '';
  inputValue = event.target.elements.searchQuery.value;
  event.preventDefault();
  event.target.reset();
  picturesSearch(inputValue, currentPage)
    .then(pictures => {
      totalHits = pictures.totalHits;
      totalPages = Math.ceil(totalHits / 40);
      if (totalHits === 0) {
        gallery.innerHTML = '';
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            width: '400px',
            borderRadius: '10px',
            position: 'right-corner',
          }
        );
      } else if (inputValue === '') {
        gallery.innerHTML = '';
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            width: '400px',
            borderRadius: '10px',
            position: 'right-corner',
          }
        );
      } else {
        gallery.innerHTML = serviceMarkup(pictures);
        lightbox.refresh();
        Notify.success(`Hooray! We found ${totalHits} images.`, {
          width: '400px',
          borderRadius: '10px',
          position: 'right-corner',
        });
      }
      if (currentPage < totalPages) {
        observer.observe(guard);
      }
    })
    .catch(() => {
      Notify.failure('Oops! Something went wrong! Try reloading the page!', {
        width: '400px',
        borderRadius: '10px',
        position: 'center-center',
      });
    });
}
