// ==UserScript==
// @name        Paywall Bypass
// @namespace   Azazar's Scripts
// @match       *://*/*
// @grant       GM_xmlhttpRequest
// @version     0.1
// @description Attempts to bypass paywalls on various websites
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/paywall-bypass.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/paywall-bypass.user.js
// @license     MIT
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current site is economist.com
    function isEconomist() {
        return window.location.hostname.includes('economist.com');
    }

    // Function to hide the paywall
    function hidePaywall() {
        const style = document.createElement('style');
        style.textContent = '.paywall { display: none !important; }';
        document.head.appendChild(style);
    }

    // Main function to bypass paywall
    function bypassPaywall() {
        if (isEconomist()) {
            console.log('Attempting to bypass paywall on economist.com...');
            hidePaywall();
        }
    }

    // Run the bypass function
    bypassPaywall();

    // Observe DOM changes to handle dynamically loaded paywalls
    const observer = new MutationObserver(() => {
        if (isEconomist()) {
            hidePaywall();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
