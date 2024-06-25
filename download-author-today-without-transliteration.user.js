// ==UserScript==
// @name        Качать с author.today названием без транслитерации
// @namespace   Azazar's Scripts
// @match       https://author.today/work/*
// @grant       none
// @version     1.1
// @description Скачивание с author.today с оригинальным названием без транслитерации
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/download-author-today-without-transliteration.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/download-author-today-without-transliteration.user.js
// @license     MIT
// ==/UserScript==

let author = Array.from(document.querySelectorAll('.book-meta-panel .book-authors a')).map(a => a.innerText).join(', ');
let title = document.querySelector('.book-meta-panel h1.book-title').innerText;

let fileName = `${title}. ${author}`;

document.querySelectorAll('a[href^="/work/download?"]').forEach(anchor => {
  let urlParams = new URLSearchParams(anchor.search);

  anchor.onclick = undefined;

  if (urlParams.has('fileName')) {
    urlParams.set('fileName', encodeURIComponent(fileName));
    anchor.search = urlParams.toString();
  }
});
