// ==UserScript==
// @name        Качать с author.today названием без транслитерации
// @namespace   Azazar's Scripts
// @match       https://author.today/work/*
// @grant       none
// @version     1.0
// @description Скачивание с author.today с оригинальным названием без транслитерации
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/download-author-today-without-transliteration.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/download-author-today-without-transliteration.user.js
// ==/UserScript==

let author = Array.from(document.querySelectorAll('.book-meta-panel .book-authors a')).map(a => a.innerText).join(', ');
let title = document.querySelector('.book-meta-panel h1.book-title').innerText;

let fileName = `${title}. ${author}`;

document.querySelectorAll('a[href^="/work/download?"]').forEach(anchor => {
  let pairs = anchor.search.substring(1).split('&');

  anchor.onclick = undefined;

  for(let i = 0; i < pairs.length; i++) {
    if (pairs[i].startsWith('fileName=')) {
      pairs[i] = 'fileName=' + encodeURIComponent(fileName);

      anchor.search = '?' + pairs.join('&');

      break;
    }
  }
});
