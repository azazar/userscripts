// ==UserScript==
// @name        Ночная читалка для Флибусты
// @namespace   Azazar's Scripts
// @match       *://flibusta.is/b/*/read
// @match       *://flibustaongezhld6dibs2dps6vm4nvqg2kp7vgowbu76tzopgnhazqd.onion/b/*/read
// @match       *://flibusta.i2p/b/*/read
// @match       *://zmw2cyw2vj7f6obx3msmdvdepdhnw2ctc4okza2zjxlukkdfckhq.b32.i2p/b/*/read
// @grant       GM_addStyle
// @version     1.2
// @description Шрифт побольше в читалке, ограничение ширины текста и ночной режим
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/flibusta-better-reader.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/flibusta-better-reader.user.js
// @license     MIT
// ==/UserScript==

GM_addStyle(`#main { line-height: 1.4em; background-color: black; color: #ffffff; font-size: 2em; padding: 0 calc((100% - 30em) / 2) 0 calc((100% - 30em) / 2) }`);
