import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import { picturesSearch } from './search-api.js';
import { serviceMarkup } from './markup.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { loadMoreShow, loadMoreHide } from './load-more.js';

const API_KEY = '38986631-ae11b42db00bd05f0f2571500';
axios.defaults.headers.common['x-api-key'] = API_KEY;

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

async function onFormSubmit(event) {
  try {
    finalText.classList.replace('final-text', 'final-text-hidden');
    gallery.innerHTML = '';
    inputValue = event.target.elements.searchQuery.value;
    event.preventDefault();
    event.target.reset();
    loadMoreHide();
    const picturesFromBackend = await picturesSearch(inputValue, currentPage);
    console.log(picturesFromBackend);
    totalHits = picturesFromBackend.totalHits;
    console.log(totalHits);
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
      gallery.innerHTML = serviceMarkup(picturesFromBackend);
      lightbox.refresh();
      loadMoreShow();
      Notify.success(`Hooray! We found ${totalHits} images.`, {
        width: '400px',
        borderRadius: '10px',
        position: 'right-corner',
      });
    }
  } catch (error) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!', {
      width: '400px',
      borderRadius: '10px',
      position: 'center-center',
    });
  }
}

async function onLoadMore() {
  try {
    currentPage += 1;

    const picturesFromBackend = await picturesSearch(inputValue, currentPage);
    // const newPics = pictures;
    totalHits = picturesFromBackend.totalHits;
    totalPages = Math.ceil(totalHits / 40);
    const picturesPerPage = picturesFromBackend.hits.length;
    gallery.insertAdjacentHTML('beforeend', serviceMarkup(picturesFromBackend));
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
  } catch (error) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!', {
      width: '400px',
      borderRadius: '10px',
      position: 'center-center',
    });
  }
}
