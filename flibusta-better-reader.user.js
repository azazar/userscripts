// ==UserScript==
// @name        Ночная читалка для Флибусты
// @namespace   Azazar's Scripts
// @match       *://flibusta.is/b/*/read
// @match       *://flibustahezeous3.onion/b/*/read
// @grant       GM_addStyle
// @version     1.2
// @description Шрифт побольше в читалке, ограничение ширины текста и ночной режим
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/flibusta-better-reader.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/flibusta-better-reader.user.js
// ==/UserScript==

GM_addStyle(`#main { line-height: 1.4em; background-color: black; color: #ffffff; font-size: 2em; padding: 0 calc((100% - 30em) / 2) 0 calc((100% - 30em) / 2) }`);
