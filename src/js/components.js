// Rendering content containers
const renderContentContainer = function (imgNmbr, galleryEl) {
  const html = `
    <figure class="content-container">
      <img 
        class="img-gallery-small"
        src=""
        data-src="./src/img/gallerySmaller/${imgNmbr}.jpg"
        data-key=${imgNmbr}
        alt="image of nature">
    </figure>
  `;
  galleryEl.insertAdjacentHTML('beforeend', html);
};

export {renderContentContainer};
