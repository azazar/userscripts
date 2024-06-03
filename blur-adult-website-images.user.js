// ==UserScript==
// @name        Blur Adult Website Images
// @namespace   Azazar's Scripts
// @match       http://*/*
// @match       https://*/*
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @license     MIT
// @version     0.3
// @description Automatically blurs images and videos on adult websites
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/blur-adult-website-images.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/blur-adult-website-images.user.js
// @license     MIT
// ==/UserScript==

(function () {
    'use strict';

    let log;

    log = () => {}
    //log = console.log;

    let blurCss = 'img,canvas,image,picture,video,iframe,.userjs-with-background-image {filter:blur(30px) !important}';

    function setBlur(onoff) {
      let id = 'blur_all_userscript';

      let styleElement = document.getElementById(id);
      let on = !!styleElement;

      if (on === onoff) {
        return;
      }

      if (onoff) {
        styleElement = document.createElement('STYLE');
        styleElement.setAttribute("id", id);
        styleElement.appendChild(document.createTextNode(blurCss));
        document.head.appendChild(styleElement);
      }
      else {
        styleElement.parentNode.removeChild(styleElement);
      }
    }

    if (localStorage.getItem('noAdultKeywordsDetected') != 'true') {
        setBlur(true);
    }

    let hostLc = location.host.toLowerCase();
    let adultAdHosts = '.exosrv.com,.contentabc.com'.split(',');

    for(let i = 0; i < adultAdHosts.length; i++) {
        if (hostLc.endsWith(adultAdHosts[i])) {
            log('adult ad host detected: ' + adultAdHosts[i]);
            setBlur(true);
            return;
        }
    }

    setInterval(function () {
        document.querySelectorAll('*[style]').forEach(function (e) {
            let backgroundImage;

            if (window.getComputedStyle) {
                backgroundImage = getComputedStyle(e)['background-image'] !== 'none';
            }
            else {
                backgroundImage = e.style['background-image'];
                if (backgroundImage) {
                    backgroundImage = backgroundImage !== 'none';
                }
            }

            if (backgroundImage) {
                e.classList.add('userjs-with-background-image');
            }
            else {
                e.classList.remove('userjs-with-background-image');
            }
        });
    }, 200);

    let adultWords =
        'fuck,milf,anal,xnxx,bbw,cum,pussy,cunt,xhamster,redtube,' +
        'xxx,porn,squirt,swinger,xvideos,tits,hardcore,masturbation,pornhub,' +
        'fucking,youporn,sexy,ass,gangbang,housewife,pussy,cock,orgasm,gay,' +
        'blowjob,bisexual,cumshot,nude,seduction,pornstar,busty,' +
        'threesome,handjob,panties,xxx,naked,adult,2257,dmca,sexual,masturbating,' +
        'hottie,hentai,cumshow,lesbian';

    adultWords += ',brazzers,pure18';

    let adultWordSet = {};
    let adultHostname = false;

    let hostnameWords = location.host.toLowerCase().split(/[\._\-0-9]+/);

    let adultWordsFound = 0;

    let minAdultWords = 2;

    adultWords.split(',').forEach(function (word) {
        adultWordSet['keyword:' + word] = true;

        hostnameWords.forEach(function (hostnamePart) {
            if (hostnamePart.endsWith(word) || hostnamePart.startsWith(word)) {
                adultHostname = true;
            }
        });
    });

    let doctypeName = document.doctype ? document.doctype.name : undefined;

    if (document.body && document.body.children.length === 1 && document.body.children[0].tagName === 'IMG') {
        doctypeName = "image";
    }

    GM_registerMenuCommand("Blur Images", () => {
        adultWordsFound += minAdultWords;
        setBlur(true);
    }, "b");

    GM_registerMenuCommand("Disable Blur", () => {
        adultWordsFound = 0;
        setBlur(false);
    }, "b");

    if (adultHostname) {
        log('Hostname contain adult keyword(s).');
        setBlur(true);
        return;
    }

    function checkTextContent() {
        if (document.querySelector('meta[name="RATING"][content="RTA-5042-1996-1400-1577-RTA"]')) {
            adultWordsFound = 100500;
            return;
        }

        if (adultWordsFound >= minAdultWords) {
            return;
        }

        let textContent = '';

        if (document.body) {
            textContent += "\n" + document.body.textContent;
        }

        document.querySelectorAll("img[alt]").forEach(function (e) {
            textContent += "\n" + e.getAttribute("alt");
        });

        document.querySelectorAll("*[title]").forEach(function (e) {
            textContent += "\n" + e.getAttribute("title");
        });

        textContent += "\n" + document.title;

        document.querySelectorAll("meta[name]").forEach(function (e) {
            if (e.getAttribute("name") === "keywords" || e.getAttribute("name") === "description") {
                textContent += "\n" + e.getAttribute("content");
            }
        });

        let matches = textContent.match(/\w+/g);

        if (matches === null) {
            log('no words found');
            return;
        }

        matches.forEach(function (match) {
            if (adultWordSet['keyword:' + match.toLowerCase()]) {
                log('Adult keyword detected: ' + match.toLowerCase());
                adultWordsFound++;
                delete adultWordSet['keyword:' + match.toLowerCase()];
            }
        });

        log('Adult keywords detected:', adultWordsFound);

        localStorage.setItem('noAdultKeywordsDetected', adultWordsFound === 0);

        if (adultWordsFound < minAdultWords) {
            setBlur(false);
        } else {
            setBlur(true);
        }
    }

    log('loading');
    checkTextContent();

    window.addEventListener('load', function (ev) {
        log('loaded');
        checkTextContent();
    });

    let observer = new MutationObserver(function() {
        log('dom modified');
        checkTextContent();
    });

    observer.observe(document, { attributes: true, childList: true, subtree: true });
})();
