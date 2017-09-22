'use strict';
var vk = require('./vkApiService.js')();
var username = 'narikoc@mail.ru';
var password = '162534a';
var attachments = ' ';


vk.login(username, password)
  .then(res => {
      var access_token;
      access_token = res.access_token;
      console.log(access_token);
      vk.stealPhoto(-151476691, access_token).then(res => {
        console.log(res.response.wall);
        var text = res.response.wall[1].text;
        vk.putPhoto(-22306255, text, attachments, access_token)
        .catch(onRejected => {
          console.log('ошииииииииибка'+onRejected);
        })
        console.log(res.response.wall[1].text);
      });
    },
    error => {
      console.log("Rejected: " + error);
    })
