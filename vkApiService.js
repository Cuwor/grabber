module.exports = function() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  require('ssl-root-cas').inject();
  const request = require('request-promise');
  const iconv = require('iconv-lite');
  const cheerio = require('cheerio');
  const fs = require('fs');

  var config = require('./config.json');

  function cookiesToString(array) {
    var str = '';
    for (var i = 0; i < array.length; i++) {
      str += array[i] + (i + 1 < array.length ? '; ' : '')
    }
    //console.log('cookies', str);
    return str;
  }

  var TEST_MODE = 0;

  var client_id = config.client_id;
  var client_secret = config.client_secret;

  return {
    login: function(username, password) {
      return request({
        method: 'POST',
        url: 'https://oauth.vk.com/token',
        qs: {
          grant_type: 'password',
          client_id: client_id,
          client_secret: client_secret,
          password: password,
          username: username // example 79135558102
        },
        json: true
      })
    },
    stealPost: function(owner_id, access_token) {
      return request({
        method: 'POST',
          url: 'https://api.vk.com/method/wall.get',
        qs: {
          owner_id: owner_id,
          count: '3',
          filter: 'owner',
          extended: '1',
          access_token: access_token
        },
        json: true
      })
    },
    putPost: function(owner_id, message, attachments, access_token) {
      return request({
        method: 'POST',
          url: 'https://api.vk.com/method/wall.post',
        qs: {
          owner_id: owner_id,
          from_group: '1',
          message: message,
          attachments: attachments,
          access_token: access_token
        },
        json: true
      })
    }
  }
};
