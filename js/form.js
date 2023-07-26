import {resetScale, smallerButton, onSmallerButtonClick, biggerButton, onBiggerButtonClick} from './scale-of-image.js';
import {resetEffects, effectsContainer, onChangeFilters} from './get-effect.js';

const NUMBER_OF_HASHTAGS = 5;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

/** тексты кнопки  */
const SubmitButtonText = {
  REST: 'Сохранить',
  SENDING: 'Сохраняю...'
};

const body = document.querySelector('body');
const upload = document.querySelector('.img-upload');
const uploadInput = upload.querySelector('.img-upload__input');
const imageElement = document.querySelector('.img-upload__preview img');
const uploadOverlay = upload.querySelector('.img-upload__overlay');
const uploadForm = upload.querySelector('.img-upload__form');
const closeButton = upload.querySelector('.img-upload__cancel');
const textAreaDescription = uploadForm.querySelector('.text__description');
const inputHashtag = uploadForm.querySelector('.text__hashtags');
const submitButton = uploadForm.querySelector('.img-upload__submit');
const effects = document.querySelectorAll('.effects__preview');
const rulesHashtag = /^#[a-zа-яё0-9]{1,19}$/i;

/** валидатор формы */
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
}, false);

/** обработчик Escape */
const onDocumentKeydown = function(evt) {
  if(evt.key === 'Escape'){
    evt.preventDefault();
    if(document.activeElement !== textAreaDescription && document.activeElement !== inputHashtag) {
      closeForm();
    }
  }
};

const onCloseButtonClick = function () {
  closeForm();
};

/** скрывает форму */
function closeForm () {
  uploadInput.value = '';
  textAreaDescription.value = '';
  inputHashtag.value = '';
  body.classList.remove('modal-open');
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
  closeButton.removeEventListener('click', onCloseButtonClick);
  resetScale();
  smallerButton.removeEventListener('click', onSmallerButtonClick);
  biggerButton.removeEventListener('click', onBiggerButtonClick);
  resetEffects();
  effectsContainer.removeEventListener('change', onChangeFilters);
  pristine.reset();
  uploadForm.reset();
}

/** показывает форму */
const openForm = function() {
  body.classList.add('modal-open');
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.addEventListener('click', onCloseButtonClick);
  smallerButton.addEventListener('click', onSmallerButtonClick);
  biggerButton.addEventListener('click', onBiggerButtonClick);
  effectsContainer.addEventListener('change', onChangeFilters);
};

/** открытие формы при загрузке файла */
const onUploadPhoto = function() {
  uploadInput.addEventListener('change', openForm);
};

/**
 *
 * @returns boolean, Проверяем массив на валидацию
 */
const validateHashtag = function () {
  if(inputHashtag.value === '') {
    return true;
  }
  const hashtagsArr = inputHashtag.value.toLowerCase().split(' ');
  const arrHashtagsNoNothing = hashtagsArr.filter((str) => str.trim() !== '');
  const arrHashtagsNoSpace = arrHashtagsNoNothing.filter((str) => str.trim() !== ' ');
  for (let i = 0; i < arrHashtagsNoSpace.length; i++) {
    if (!rulesHashtag.test(arrHashtagsNoSpace[i]) || arrHashtagsNoSpace.indexOf(arrHashtagsNoSpace[i]) !== i || arrHashtagsNoSpace.length > NUMBER_OF_HASHTAGS) {
      return false;
    }
  }
  return true;
};

/** Функция строки ошибки */
const getErrorMessages = function () {
  const hashtagLowerCase = inputHashtag.value.toLowerCase();
  const arrHashtags = hashtagLowerCase.split(' ');
  const arrHashtagsNoNothing = arrHashtags.filter((str) => str.trim() !== '');
  const arrHashtagsNoSpace = arrHashtagsNoNothing.filter((str) => str.trim() !== ' ');
  let messageOne = '';
  let messageTwo = '';
  let messageThree = '';
  let errorMessage = '';
  for (let i = 0; i < arrHashtagsNoSpace.length; i++) {
    if(!rulesHashtag.test(arrHashtagsNoSpace[i])) {
      messageOne = 'введён невалидный хэш-тег\n';
    }
    if(arrHashtagsNoSpace.indexOf(arrHashtagsNoSpace[i]) !== i) {
      messageTwo = 'хэш-теги повторяются\n';
    }
    if(arrHashtagsNoSpace.length > NUMBER_OF_HASHTAGS) {
      messageThree = 'превышено количество хэш-тегов\n';
    }
    errorMessage = messageOne + messageTwo + messageThree;
  }
  return errorMessage;
};

pristine.addValidator(inputHashtag,
  validateHashtag,
  getErrorMessages
);

/** Блокировка кнопки отправки формы */
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

/** Разблокировка кнопки отправки формы */
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.REST;
};


const setCallbackForm = (cb) => {
  uploadForm.addEventListener('submit', async (evt) => { /** установка обработчика для отправки формы */
    evt.preventDefault();
    const isValidate = pristine.validate();

    if(isValidate) {
      blockSubmitButton();
      await cb(new FormData(uploadForm));
      unblockSubmitButton();
    }
  });
};

/** проверяет загруженный файл */
const onFileInputChange = () => {
  const file = uploadInput.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if(matches) {
    imageElement.src = URL.createObjectURL(file);
    effects.forEach((item) => (item.style.backgroundImage = `url(${imageElement.src})`));
    openForm();
  }
};

uploadInput.addEventListener('change', onFileInputChange);

export {onUploadPhoto, setCallbackForm as createSendForm, closeForm, unblockSubmitButton, onDocumentKeydown as onFormEsc};
