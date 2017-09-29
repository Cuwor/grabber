'use strict';
var vk = require('./vkApiService.js')();
var config = require('./config.json');

vk.login(config.username, config.password)
  .then(res => {
      var access_token;
      access_token = res.access_token;
      //console.log(access_token);
      vk.stealPost(config.group_steal, access_token).then(resp => {
        if (resp.response.wall[1].is_pinned != 1) {
          var post_id = resp.response.wall[1].id;
        } else {
          var post_id = resp.response.wall[2].id;
        }
        vk.stealDataPost(config.group_steal, post_id, access_token).then(res => {
          //console.log(res.response);
          var text = res.response[0].text;
          var urlSearch = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
          if (text.search(urlSearch) == 0) {

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

            var attachList = res.response[0].attachments;
            var attachments = "";
            for (var i = 0; i < attachList.length; i++) {
              if (attachList[i].type == 'doc') {
                attachments += attachList[i].type + attachList[i].doc.owner_id + '_' + attachList[i].doc.did + ",";
              } else if(attachList[i].type == 'photo'){
                attachments += attachList[i].type + attachList[i].photo.owner_id + '_' + attachList[i].photo.pid + ",";
              } else if(attachList[i].type == 'audio'){
                attachments += attachList[i].type + attachList[i].audio.owner_id + '_' + attachList[i].audio.aid + ",";
              }
            }

            vk.putPost(config.group_put, text, attachments, access_token).then(res => {
                console.log(text);
              })
              .catch(onRejected => {
                console.log('Ошииииииииибка -------------------------- ' + onRejected);
              })
          }

        });
      });
    },
    error => {
      console.log("Rejected: " + error);
    })
