import Ember from 'ember';
import fetch from 'ember-network/fetch';

import config from 'ocr-feed-client/config/environment';

const Message = Ember.Object.extend({});

export default Ember.Route.extend({
  model() {
    return fetch(`${config.APP.apiHost}/messages`)
      .then((res) => res.json())
      .then((json) => {
        return json.data.map((d) => Message.create(d));
      });
  },

  actions: {
    create(message) {
      return fetch(`${config.APP.apiHost}/messages`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(message.getProperties(['content'])),
        })
        .then((res) => {
          message.set('content', '');
          return this.refresh();
        });
    },
    update(message) {
      return fetch(`${config.APP.apiHost}/messages/${message.id}`, {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(message.getProperties(['content'])),
        })
        .then((res) => {
          this.set('controller.selectedMessage', null);
          return this.refresh();
        });
    },
    delete(message) {
      return fetch(`${config.APP.apiHost}/messages/${message.id}`, {
          method: 'DELETE',
        })
        .then((res) => {
          this.set('controller.selectedMessage', null);
          return this.refresh();
        });
    },

    select(message) {
      const selectedMessage = this.get('controller.selectedMessage');
      if (selectedMessage === message) {
        this.set('controller.selectedMessage', null);
      } else {
        this.set('controller.selectedMessage', message);
      }
      if (!message) {
        return;
      }
      message.set('palindromeLoaded', false);
      fetch(`${config.APP.apiHost}/messages/${message.get('id')}/isPalindrome`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          },
        })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          message.set('isPalindrome', json.isPalindrome);
          message.set('palindromeLoaded', true);
        });

    },
  },
});
