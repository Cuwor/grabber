'use strict';
var vk = require('./vkApiService.js')();
var username = '89082045697'; // С ПРИВЯЗКОЙ К ТЕЛЕФОНУ!!! Иначе не работает
var password = 'dl494kr9ir4ori';



vk.login(username, password)
  .then(res => {
      var access_token;
      access_token = res.access_token;
      //console.log(access_token);
      vk.stealPost(-151476691, access_token).then(res => {
        //console.log(res.response.wall);
        var text = res.response.wall[2].text;
        var textList = text.split(' ');
        for (var i = 0; i < textList.length; i++) {
          var tag = textList[i].match(/#/ig);
          if (tag != null) {
            textList.splice(i,1);
          }
        }
        //console.log(textList);
        text = textList.join(' ');
        text = text.replace(/<br>/gi, "\n");
        console.log(text);
        var attachments = 'photo' + res.response.wall[2].media.owner_id + '_' + res.response.wall[2].media.item_id;
        vk.putPost(-153992110, text, attachments, access_token).then(res => {
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
