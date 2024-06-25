// ==UserScript==
// @name        Качать с Флибусты файлы с адекватными названиями
// @namespace   Azazar's Scripts
// @match       *://flibusta.is/a/*
// @match       *://flibusta.is/s/*
// @match       *://flibusta.is/sequence/*
// @grant       GM_setClipboard
// @grant       GM_download
// @version     1.5
// @description Добавляет название книги и автора в название загружаемого файла на flibusta.is. Пока работает только на страницах авторов, которые со всему книгами.
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/flibusta-download-filename-builder.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/flibusta-download-filename-builder.user.js
// @license     MIT
// ==/UserScript==

let extMap = {
    'fb2': '.fb2.zip',
    'epub': '.epub',
    'mobi': '.mobi',
};

let author = document.querySelector('h1.title').innerText;

let books = {};

let sequence = null;

if (location.pathname.match(/^\/s\//)) {
  sequence = document.querySelector('h1.title').innerText.trim();
}

Array.from(document.querySelectorAll('form[action^="/a/"] a[href], form[action^="/mass/download"] a[href], #main a[href]')).forEach(a => {
    let href = a.getAttribute("href");

    if (href.startsWith('/s/')) {
      sequence = a.innerText.trim();

      return;
    }

    let match = href.match(/^\/b\/(\d+)$/);

    if (match) {
        let bookId = match[1];
        books[bookId] = a.innerText.trim();

        if (sequence !== null && a.previousSibling.nodeType === Node.TEXT_NODE) {
          match = a.previousSibling.textContent.match(/^ *- (\d+)\. *$/);

          if (match) {
            let number = match[1];

            books[bookId] = `${sequence} ${number}. ${a.innerText.trim()}`;
          }
        }

        return;
    }

    match = href.match(/^\/b\/(\d+)\/(fb2|epub|mobi|download)$/);

    if (match) {
        let id = match[1];
        let type = match[2];

        if (type === 'download' && a.innerText === '(скачать)') {
          type = 'fb2';
        }

        if (books[id]) {
            let title = books[id];

            if (!/[\.!\?]$/.test(title)) {
                title += '.';
            }

            let ext = extMap[type];

            if (ext === undefined) {
              ext = type;
            }

            let filename = `${title} ${author}${ext}`;

            a.addEventListener('click', (event) => {
                if (type && type !== '') {
                  event.preventDefault();

                  let downloadUrl = a.href;

                  GM_download({
                      url: downloadUrl,
                      name: filename,
                      saveAs: true // optional, to prompt for location
                  });
                }
                else {
                  GM_setClipboard(filename);
                }
            });
        }
    }
});
