const defaults = {
  webformatURL:
    'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
  largeImageURL:
    'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
  tags: 'no description',
  likes: '0',
  views: '0',
  comments: '0',
};

export function serviceMarkup(picturesFromBackend) {
  const markup = picturesFromBackend.data.hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return ` 
           <div class="photo-card">
            <a class="gallery-link link" href="${
              largeImageURL || defaults.largeImageURL
            }">
                <img src="${webformatURL || defaults.webformatURL}" alt="${
          tags || defaults.tags
        }" width="300" height="200" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes: ${likes || defaults.likes}</b>
              </p>
              <p class="info-item">
                <b>Views: ${views || defaults.views}</b>
              </p>
              <p class="info-item">
                <b>Comments: ${comments || defaults.comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads: ${downloads || defaults.downloads}</b>
              </p>
            </div>
            </div>
          `;
      }
    )
    .join('');
  return markup;
}
