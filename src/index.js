import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { picturesSearch } from './search-api.js';
import { serviceMarkup } from './markup.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { loadMoreShow, loadMoreHide } from './load-more.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.js-load-more');
const finalText = document.querySelector('.js-final-text');
let inputValue = '';
let currentPage = 1;
let totalPages = 0;
let totalHits = 0;
const lightbox = new SimpleLightbox('.gallery a');

loadMoreBtn.addEventListener('click', onLoadMore);
form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  finalText.classList.replace('final-text', 'final-text-hidden');
  currentPage = 1;
  gallery.innerHTML = '';
  inputValue = event.target.elements.searchQuery.value;
  event.preventDefault();
  event.target.reset();
  loadMoreHide();
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
        loadMoreShow();
        Notify.success(`Hooray! We found ${totalHits} images.`, {
          width: '400px',
          borderRadius: '10px',
          position: 'right-corner',
        });
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

function onLoadMore() {
  currentPage += 1;

  picturesSearch(inputValue, currentPage).then(pictures => {
    totalHits = pictures.totalHits;
    totalPages = Math.ceil(totalHits / 40);
    const picturesPerPage = pictures.hits.length;
    gallery.insertAdjacentHTML('beforeend', serviceMarkup(pictures));
    lightbox.refresh();

    if (picturesPerPage * currentPage >= totalHits) {
      loadMoreHide();
      finalText.classList.replace('final-text-hidden', 'final-text');
    }
    if (currentPage >= totalPages) {
      loadMoreHide();
      finalText.classList.replace('final-text-hidden', 'final-text');
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}
