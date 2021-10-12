import { renderContentContainer } from "./components";

const numOfImgs = 62;
const galleryEl = document.querySelector('.gallery');
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal-img');
const overlay = document.querySelector('.overlay');
const aboutModal = document.querySelector('.about-modal');
const year = document.querySelector('.year');

// Footer year
  year.textContent = new Date().getFullYear();

// If page gets refreshed it scrolls back to top
window.onbeforeunload = function() {
  window.scrollTo(0,0);
};

// Stop scrolling (when modal is shown)
const eventCodes = {'Home':1, 'End':1, 'PageUp':1, 'PageDown':1, 'ArrowUp':1, 'ArrowDown':1, 'Space':1};
// auxclick not working as intended on Logitech G402, so am not going to include it
const preventDefault = function(e) {
  e.preventDefault();
};

const preventDefaultForKeys = function(e) {
  if(eventCodes[e.code])
    preventDefault(e);
};

const disableScroll = function() {
  window.addEventListener('wheel', preventDefault, { passive: false }); // Mouse scroll wheel event
  window.addEventListener('touchmove', preventDefault, { passive: false }); // Mobile touch/move event
  window.addEventListener('keydown', preventDefaultForKeys);
};
const enableScroll = function() {
  window.removeEventListener('wheel', preventDefault, { passive: false });
  window.removeEventListener('touchmove', preventDefault, { passive: false });
  window.removeEventListener('keydown', preventDefaultForKeys);
};


const addFirstNImages = function() {
  for (let i = 1; i <= numOfImgs; i++) {
    const imgNmbr = String(i).padStart(2, 0);

    renderContentContainer(imgNmbr, galleryEl);
  };
};

// IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSION), Adding images and observers, using both function declarations and expressions just to showcase hoisting declarations
(function() {
  addFirstNImages();
  const images = document.querySelectorAll("img[data-src]");
  addObservers(images);
}());

function addObservers(imgs) {
  // Lazy loading the images
  const imgTargets = imgs;
  const options = {
    rootMargin: "200px",
    threshold: 0,
  };

  const loadImg = function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.src = entry.target.dataset.src;
    });

    // When it intersects the last image it stops observing
    if(entries.find(entry => entry.target.dataset.key === numOfImgs.toString() && entry.isIntersecting)) {
      imgTargets.forEach((img) => imgObserver.unobserve(img));
    }
  };

  const imgObserver = new IntersectionObserver(loadImg, options);

  imgTargets.forEach((img) => imgObserver.observe(img));
};

function toggleModalClasses() {
  modal.classList.toggle('hidden');
  modalImg.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

function toggleAboutClasses() {
  aboutModal.classList.toggle('hidden-about');
};

function showModal(key) {
  toggleModalClasses();
  modalImg.src = `./src/img/gallery/${key}.jpg`;
};

// Click event handling for everything
let isAboutModalOpen = false;
window.addEventListener('click', e => {
  const targetClass = e.target.classList[0];

  // About section
  if(targetClass === 'about') {
     toggleAboutClasses();
     isAboutModalOpen = !isAboutModalOpen;
     if (isAboutModalOpen)
      disableScroll();
     if (!isAboutModalOpen)
      enableScroll();
  }

  // Modal section (img gallery)
  if (targetClass === 'modal-img' || targetClass === 'overlay') {
    toggleModalClasses();
    enableScroll();
    // clear source after css scale animation ends
    setTimeout(() => {
      modalImg.src = '';
    }, 200);
  }
  if (targetClass === 'img-gallery-small') {
    showModal(e.target.dataset.key);
    disableScroll();
  }
});
