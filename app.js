'use strict';
var vk = require('./vkApiService.js')();
var username = 'narikoc@mail.ru';// С ПРИВЯЗКОЙ К ТЕЛЕФОНУ!!! Иначе не работает
var password = '162534a';
var attachments = '';


vk.login(username, password)
  .then(res => {
      var access_token;
      access_token = res.access_token;
      console.log(access_token);
      vk.stealPost(-151476691, access_token).then(res => {
        console.log(res.response.wall);
        var text = res.response.wall[1].text;
        vk.putPost(-22299084, text, attachments, access_token).then(res => {
          console.log(text);
        })
        .catch(onRejected => {
          console.log('Ошииииииииибка -------------------------- '+onRejected);
        })
      });
    },
    error => {
      console.log("Rejected: " + error);
    })
