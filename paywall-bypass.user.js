// ==UserScript==
// @name        Paywall Bypass
// @namespace   Azazar's Scripts
// @match       *://*/*
// @run-at      document-start
// @version     0.1
// @description Attempts to bypass paywalls on various websites
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/paywall-bypass.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/paywall-bypass.user.js
// @license     MIT
// ==/UserScript==

(function() {
    'use strict';

    const tld = location.hostname.replace(/^www\./, '');

    if ("economist.com" === tld) {
        Object.defineProperty(unsafeWindow, 'wallInfo', {
            set(value) {
            },
            get() {
                return {
                    status: null,
                    type: null,
                    metadata: {},
                };
            },
        });
    }
})();
