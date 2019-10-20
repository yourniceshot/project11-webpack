const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort3/' : 'https://praktikum.tk/cohort3/';

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

export const api = new Api(serverUrl, 'c01b9357-4aba-4abb-8c3d-32a2a5face4c');