module.exports = function() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  require('ssl-root-cas').inject();
  const request = require('request-promise');
  const iconv = require('iconv-lite');
  const cheerio = require('cheerio');
  const fs = require('fs');

  function cookiesToString(array) {
    var str = '';
    for (var i = 0; i < array.length; i++) {
      str += array[i] + (i + 1 < array.length ? '; ' : '')
    }
    //console.log('cookies', str);
    return str;
  }

  var TEST_MODE = 0;

  var client_id = '3140623';
  var client_secret = 'VeWdmVclDCtn6ihuP1nt';

  return {
    signup: function(phone, firstName, lastName, password, sex) {
      return request({
        method: 'POST',
        url: 'https://api.vk.com/method/auth.signup',
        qs: {
          first_name: firstName,
          last_name: lastName,
          client_id: client_id,
          client_secret: client_secret,
          password: password,
          test_mode: TEST_MODE, // 0 - выключено, 1 - включено
          sex: sex, // sex 1 - female, 2 - male
          phone: phone
        },
        json: true
      })
    },
    confirmSignup: function(phone, code, password) {
      return request({
        method: 'POST',
        url: 'https://api.vk.com/method/auth.confirm',
        qs: {
          client_id: client_id,
          client_secret: client_secret,
          code: code,
          test_mode: TEST_MODE, // 0 - выключено, 1 - включено
          phone: phone,
          password: password
        },
        json: true
      })
    },
    checkPhone: function(phone, authByPhone) {
      return request({
        method: 'POST',
        url: 'https://api.vk.com/method/auth.checkPhone',
        qs: {
          client_id: client_id,
          client_secret: client_secret,
          auth_by_phone: authByPhone ? 1 : 0, // 1 — проверить правильность номера для авторизации, а не для регистрации нового аккаунта. По умолчанию: 0.
          phone: phone
        },
        json: true
      })
    },
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
    uploadPhoto: function(access_token, user_id, sex) {
      console.log('Upload profile photo user_id: ', user_id);
      console.log('photos.getOwnerPhotoUploadServer');
      return request({
        method: 'GET',
        url: 'https://api.vk.com/method/photos.getOwnerPhotoUploadServer',
        qs: {
          access_token: access_token,
          owner_id: user_id,
          //captcha_key: 'vh7un7'
        },
        json: true
      })
        .then(res => {
          var filePath = APP.APP_ROOT + '/photos/' + (Math.floor(Math.random() * 20) + 1) + (sex == 1 ? '_female.jpg' : '.jpg'); // rnd from 1 to 20
          console.log('Photos Upload', filePath);
          if (res.response && res.response.upload_url) {
            return request({
              method: 'POST',
              url: res.response.upload_url,
              formData: {
                photo: fs.createReadStream(filePath)
              },
              json: true
            })
          } else {
            throw 'photos.getOwnerPhotoUploadServer error';
          }
        })
        .then(res => {
          console.log('photos.saveOwnerPhoto');
          if (res.hash && res.server && res.photo) {
            console.log(request);
            return request({
              method: 'POST',
              url: 'https://api.vk.com/method/photos.saveOwnerPhoto',
              qs: {
                owner_id: user_id,
                access_token: access_token,
                server: res.server,
                hash: res.hash,
                photo: res.photo
              },
              json: true
            })
              .then(res => {
                if (res.response && res.response.saved) {
                  return true;
                } else {
                  throw 'Save avatar error';
                }
              })
          } else {
            throw 'Photos Upload error';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    stealPhoto: function(owner_id, access_token) {
      return request({
        method: 'POST',
          url: 'https://api.vk.com/method/wall.get',
        qs: {
          owner_id: owner_id,
          count: 5,
          filter: 'owner',
          extended: 1,
          access_token: access_token
        },
        json: true
      })
    }
  }
};
