'use strict';

var vk = require('./vkApiService.js')();
var username = 'narikoc@mail.ru';
var password = '162534a';


var access_token = vk.getAccessToken();
//console.log(access_token);
vk.login(username, password);
vk.uploadPhoto(access_token, 112798061, 2);
