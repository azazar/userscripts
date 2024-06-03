// ==UserScript==
// @name        Добавляем на author.today ссылки на fantlab
// @namespace   Azazar's Scripts
// @match       https://author.today/*
// @grant       none
// @version     1.1
// @description Добавляем на author.today ссылки на поиск fantlab
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/add-fantlab-links-to-author-today.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/add-fantlab-links-to-author-today.user.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Checks if all children of a DOM element are text nodes.
     *
     * @param {Element} domElement - The DOM element to check.
     * @return {boolean} - Returns true if all children are text nodes, otherwise false.
     */
    function isTextOnly(domElement) {
      // Get all child nodes of the element
      const childNodes = domElement.childNodes;

      if (childNodes.length === 0) {
        return false;
      }

      // Iterate through the child nodes
      for (let i = 0; i < childNodes.length; i++) {
        // If the node is not a text node, return false
        if (childNodes[i].nodeType !== Node.TEXT_NODE) {
          return false;
        }
      }

      // If all child nodes are text nodes, return true
      return true;
    }

    function addFantlabLinks(root) {
        root.querySelectorAll('.feed .feed-row, .bookcard, .book-row').forEach(feedRowElement => {
            if (feedRowElement.fantlabLinksAdded) {
                return;
            }

            feedRowElement.fantlabLinksAdded = true;

            let authors = [];

            let anchors = Array.from(feedRowElement.querySelectorAll('a[href]')).filter(a => isTextOnly(a));

            anchors.forEach(anchorElement => {
                let href = anchorElement.getAttribute('href');

                let userMatch = /^\/u\/([^\/]+)/.exec(href);

                if (userMatch) {
                    authors.push(anchorElement.textContent.trim());

                    anchorElement.insertAdjacentHTML('afterend', ` (<a href="https://fantlab.ru/searchmain?searchstr=${encodeURIComponent(anchorElement.textContent.trim())}">FantLab</a>)`);
                }
            });

            anchors.forEach(anchorElement => {
                let href = anchorElement.getAttribute('href');

                let workMatch = /^\/work\/(\d+)/.exec(href);

                if (workMatch) {
                    anchorElement.insertAdjacentHTML('afterend', ` (<a href="https://fantlab.ru/searchmain?searchstr=${encodeURIComponent(anchorElement.textContent.trim() + ' ' + authors.join(' '))}">FantLab</a>)`);
                }
            });
        });
    }

    // Initial run on page load
    addFantlabLinks(document.body);

    // Observe changes to the body and dynamically apply the function to new elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addFantlabLinks(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
