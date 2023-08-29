const loadMoreBtn = document.querySelector('.js-load-more');

export function loadMoreHide() {
  loadMoreBtn.classList.replace('button-79', 'load-more-hidden');
}

export function loadMoreShow() {
  loadMoreBtn.classList.replace('load-more-hidden', 'button-79');
}
