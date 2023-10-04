import {renderGallery} from './gallery.js';
import {debounce} from './util.js';

const PHOTO_COUNT = 10;
const DEBOUNCE_TIME = 500;

const imgFilters = document.querySelector('.img-filters');
const imgForm = document.querySelector('.img-filters__form');
const defaultFilter = document.querySelector('#filter-default');
const randomFilter = document.querySelector('#filter-random');
const commentsFilter = document.querySelector('#filter-discussed');
const filterButtons = document.querySelectorAll('.img-filters__button');

/** показывает фильтры */
const initFilters = () => imgFilters.classList.remove('img-filters--inactive');

/** сортирует изображения */
const filtersPictures = (pictures, choiceButton) => {
  if (choiceButton === defaultFilter) {
    return pictures;
  }
  if (choiceButton === randomFilter) {//Случайные изображения
    return pictures.slice().sort(() => Math.random() - 0.5).slice(0, PHOTO_COUNT);
  }
  if (choiceButton === commentsFilter) {//Обсуждаемые изображения
    return pictures.slice().sort((a, b) => b.comments.length - a.comments.length);
  }
};

/** удаляет изображения галереи */
const removePictures = () =>
  document.querySelectorAll('.picture').forEach((picture) => picture.remove());

/** обновляет галерею */
const updateGallery = (pictures) => {
  removePictures();
  renderGallery(pictures);
};

/** дебаунс updateGallery */
const debouncedRenderGallery = debounce(updateGallery, DEBOUNCE_TIME);

/** обработчик клика */
const onFilterClick = (evt, pictures) => {
  filterButtons.forEach((button) => button.classList.remove('img-filters__button--active'));

  const filterButton = evt.target;
  filterButton.classList.add('img-filters__button--active');
  debouncedRenderGallery(filtersPictures(pictures, filterButton));
};

/** устанавливает дебаунс */
const setDelayedFilter = (pictures) => {
  imgForm.addEventListener('click', (evt) => {
    onFilterClick(evt, pictures);
  });
};
export {setDelayedFilter, initFilters};
