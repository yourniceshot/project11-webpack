class Card {
  constructor(name, link) {
    this.cardElement = this.create(name, link);

    this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
    this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
  }

  like(event) {
    if (event.target.classList.contains('place-card__like-icon')){
      event.target.classList.toggle('place-card__like-icon_liked');
    }
  }

  remove(event) {
    event.target.closest('.place-card').remove();
  }

  create(nameValue, linkValue) {
    const placeCard = document.createElement('div');
    placeCard.classList.add('place-card');

    const bg = document.createElement('div');
    bg.classList.add('place-card__image');
    bg.style.backgroundImage = `url(${linkValue})`;

    const descrp = document.createElement('div');
    descrp.classList.add('place-card__description');

    const cardName = document.createElement('h3');
    cardName.classList.add('place-card__name');
    cardName.textContent = nameValue;

    const deleteBttn = document.createElement('button');
    deleteBttn.classList.add('place-card__delete-icon');

    const likeBttn = document.createElement('button');
    likeBttn.classList.add('place-card__like-icon');

    placeCard.appendChild(bg);
    bg.appendChild(deleteBttn);
    placeCard.appendChild(descrp);
    descrp.appendChild(cardName);
    descrp.appendChild(likeBttn);

    return placeCard;
  }
}

class СardList {
  constructor(container, cards) {
    this.container = container;
    this.cards = cards;
    this.render();
  }

  addCard(name, link) {
    const { cardElement } = new Card(name, link);
    this.container.appendChild(cardElement);
  }

  render(){
    this.cards.forEach((card) => {
      this.addCard(card.name, card.link);
    });
  }
}

class Popup {
  constructor(popupElem, button){
    this.popupElem = popupElem;
    this.button = button;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.popupElem.querySelector('.popup__close').addEventListener('click', this.close);
    this.button.addEventListener('click', this.open);
  }

  open() {
    this.popupElem.classList.add('popup_is-opened');

  }

  close(){
    this.popupElem.classList.remove('popup_is-opened');
  }
}

class Api {
  constructor(baseUrl, auth){
    this.baseUrl = baseUrl;
    this.auth = auth;
  }

  getCards() {
    return fetch(`${this.baseUrl}cards`, {
      headers: {
        authorization: this.auth,
        'Content-Type': 'application/json'
      }
    })
  
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
  }

  getProfile(){
    return fetch(`${this.baseUrl}users/me`, {
      headers: {
        authorization: this.auth,
        'Content-Type': 'application/json'
      }
    })
        .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
    }  

  updateProfile(name, about) {
    return fetch(`${this.baseUrl}users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
  }

  saveCard(name, link) {
    return fetch(`${this.baseUrl}cards`, {
      method: 'POST', 
      headers: {
        authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    }) 
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
  }

  changeAvatar(avatar) {
    return fetch(`${this.baseUrl}users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatar
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
  }
}

const root = document.querySelector('.root');
const placesList = root.querySelector('.places-list');
const popupNewPlace = root.querySelector('.popup-newplace');
const popupEditProfile = document.querySelector('.popup-profile');
const popupForm = document.querySelectorAll('.popup');
const addBttn = root.querySelector('.user-info__button');
const xBttn = document.querySelectorAll('.popup__close');
const likeBttn = document.querySelector('.place-card__like-icon');
const plusBttn = document.querySelector('.plus-button');
const editBttn = document.querySelector('.user-info__edit-button');
const saveBttn = document.querySelector('.save-button');
const userName = root.querySelector('.user-info__name');
const userJob = root.querySelector('.user-info__job');
const userPhoto = root.querySelector('.user-info__photo');
const editInfoForm = document.forms.edit;
const userNameField = editInfoForm.elements.person;
const errorFieldTop = document.querySelector('.input-error_field-top');
const errorSymbolsTop = document.querySelector('.input-error_symbols-top');
const userJobField = editInfoForm.elements.about;
const errorFieldBottom = document.querySelector('.input-error_field-bottom');
const errorSymbolsBottom = document.querySelector('.input-error_symbols-bottom');
const newPlaceForm = document.forms.new;
const popupPlace = new Popup(popupNewPlace, addBttn);
const popupInfo = new Popup(popupEditProfile, editBttn);
const scaledPopup = root.querySelector('.popup-big');
const api = new Api('http://95.216.175.5/cohort3/', 'c01b9357-4aba-4abb-8c3d-32a2a5face4c');
const avaBttn = root.querySelector('.user-info__photo');
const popupAva = root.querySelector('.popup-avatar');
const popupUserpic = new Popup(popupAva, avaBttn);
const avatarForm = document.forms.avatar;
const avatarLinkField = avatarForm.elements.ava_link;
const avaSaveBttn = root.querySelector('.ava-save-button');

let cardList;
  api.getCards()
  .then((data) => {
    cardList = new СardList(placesList, data);
  })
  .catch((err) => console.log(err));


api.getProfile()
.then((data) => {
  userName.textContent = data.name;
  userJob.textContent = data.about;
  userPhoto.setAttribute('src', data.avatar);
  })
.catch((err) => {
  console.log(err);
});

avaSaveBttn.addEventListener('click', function(event){
  event.preventDefault();
  api.changeAvatar(avatarLinkField.value)
  .then(() => {
    userPhoto.setAttribute('src', avatarLinkField.value);
    popupUserpic.close();
    avatarForm.reset();
  })
});

avatarLinkField.addEventListener('input', function(){
  if (avatarLinkField.value.length === 0) {
    avaSaveBttn.classList.remove('button-enabled');
    avaSaveBttn.setAttribute('disabled', true);
  } else {
    avaSaveBttn.classList.add('button-enabled');
    avaSaveBttn.removeAttribute('disabled');
  }
})

avaBttn.addEventListener('click', function(){
  avaSaveBttn.classList.remove('button-enabled');
  avaSaveBttn.setAttribute('disabled', true);
})

function newCard(event) {
  event.preventDefault();
  const form = document.forms.new;
  const name = form.elements.name;
  const link = form.elements.link;
  api.saveCard(name.value, link.value)
  .then(() => {
    cardList.addCard(name.value, link.value);
    popupPlace.close();
    form.reset();
  })
  .catch((err) => {
    console.log(err);
  })
}

function changeInfo(personValue, aboutValue) {
  userName.textContent = personValue;
  userJob.textContent = aboutValue;
}

function editInfo(event) {
  event.preventDefault();
  const form = document.forms.edit;
  const person = form.elements.person;
  const about = form.elements.about;

  api.updateProfile(person.value, about.value)
  .then(() => {
    changeInfo(person.value, about.value);
    popupInfo.close();
    form.reset();
  })
  .catch((err) => {
    console.log(err);
  })
}

addBttn.addEventListener('click', function(){
  plusBttn.setAttribute('disabled', true);
  plusBttn.classList.remove('button-enabled');
});

editBttn.addEventListener('click', function(){
  const personString = userName.innerHTML;
  const jobString = userJob.innerHTML;
  const form = document.forms.edit;
  let person = form.elements.person;
  let about = form.elements.about;
  person.value = personString;
  about.value = jobString;
  saveBttn.classList.add('button-enabled');
  errorFieldTop.classList.remove('fields-top-open');
  errorFieldBottom.classList.remove('fields-bottom-open');
  errorSymbolsBottom.classList.remove('symbols-bottom-open');
  errorSymbolsTop.classList.remove('symbols-top-open');
});

document.forms.new.addEventListener('submit', newCard);

document.forms.edit.addEventListener('submit', editInfo);

placesList.addEventListener('click', function (event) {
  event.stopPropagation()
  const { target } = event;
  if (target.classList.contains('place-card__image')) {
    const pictureBttn = document.querySelector('.place-card__image');
    const popupPicture = new Popup(scaledPopup, pictureBttn);
    popupPicture.open();
    const linkValue = target.style.backgroundImage;
    const popupImage = root.querySelector('.popup-image');
    const linkValueFormatted = linkValue.slice(linkValue.indexOf('url') + 5, -2);
    popupImage.setAttribute('src', linkValueFormatted);
  }
})

editInfoForm.addEventListener('input', function(){
  if (userNameField.value.length < 2 || userJobField.value.length < 2 || userNameField.value.length > 30 || userJobField.value.length > 30) {
    saveBttn.classList.remove('button-enabled');
    saveBttn.setAttribute('disabled', true);
  } else {
    saveBttn.removeAttribute('disabled');
    saveBttn.classList.add('button-enabled');
  }
})

userNameField.addEventListener('input', function(){
  if (userNameField.value.length === 0){
    saveBttn.classList.remove('button-enabled');
    saveBttn.setAttribute('disabled', true);
    errorFieldTop.classList.add('fields-top-open');
  } else {
    errorFieldTop.classList.remove('fields-top-open');
    saveBttn.removeAttribute('disabled');
    saveBttn.classList.add('button-enabled');
  }
})

userNameField.addEventListener('input', function(){
  if (userNameField.value.length < 2 || userNameField.value.length > 30) {
    errorSymbolsTop.classList.add('symbols-top-open');
  } else {
    errorSymbolsTop.classList.remove('symbols-top-open');
  }
})

userJobField.addEventListener('input', function(){
  if (userJobField.value.length === 0) {
    saveBttn.classList.remove('button-enabled');
    saveBttn.setAttribute('disabled', true);
    errorFieldBottom.classList.add('fields-bottom-open');
  } else {
    saveBttn.classList.add('button-enabled');
    saveBttn.removeAttribute('disabled');
    errorFieldBottom.classList.remove('fields-bottom-open');
  }
})

userJobField.addEventListener('input', function(){
  if (userJobField.value.length < 2 || userJobField.value.length > 30) {
    errorSymbolsBottom.classList.add('symbols-bottom-open');
  } else {
    errorSymbolsBottom.classList.remove('symbols-bottom-open');
  }
})

newPlaceForm.addEventListener('input', function(){
  const placeName = newPlaceForm.elements.name;
  const placeLink = newPlaceForm.elements.link;
  if (placeName.value.length > 1 && placeLink.value.length > 1) {
    plusBttn.classList.add('button-enabled');
    plusBttn.removeAttribute('disabled');
 } else {
   plusBttn.setAttribute('disabled', true);
   plusBttn.classList.remove('button-enabled');
  }
});