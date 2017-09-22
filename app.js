'use strict';

var vk = require('./vkApiService.js')();
var username = 'narikoc@mail.ru';
var password = '162534a';
var access_token;
var user = vk.login(username, password).then(res => {access_token = res.access_token});

var stealData = vk.stealPhoto(-151476691, access_token).then(res => {console.log(res);});
