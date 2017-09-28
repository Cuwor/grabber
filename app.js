'use strict';
var vk = require('./vkApiService.js')();
var config = require('./config.json');

vk.login(config.username, config.password)
  .then(res => {
      var access_token;
      access_token = res.access_token;
      //console.log(access_token);
      vk.stealPost(config.group_steal, access_token).then(res => {
        console.log(res.response.wall);
        for (var i = 2; i < res.response.wall.length; i++) {
          var text = res.response.wall[i].text;
          var urlSearch = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
          if (text.search(urlSearch) == -1) {
            var textList = text.split(' ');
            for (var j = 0; j < textList.length; j++) {
              var tag = textList[j].match(/#/ig);
              if (tag != null) {
                textList.splice(j, 1);
              }
            }
            //console.log(textList);
            text = textList.join(' ');
            text = text.replace(/<br>/gi, "\n");
            //console.log(text);
            if (res.response.wall[i].media != null) {
              var attachments = res.response.wall[i].media.type + res.response.wall[i].media.owner_id + '_' + res.response.wall[i].media.item_id;
              console.log(attachments);
            }


            // vk.putPost(config.group_put, text, attachments, access_token).then(res => {
            //     console.log(text);
            //   })
            //   .catch(onRejected => {
            //     console.log('Ошииииииииибка -------------------------- ' + onRejected);
            //   })
          }
        }
      });
    },
    error => {
      console.log("Rejected: " + error);
    })
