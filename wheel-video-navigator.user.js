// ==UserScript==
// @name        Wheel Video Navigator
// @namespace   Azazar's Scripts
// @match       *://*/*
// @grant       none
// @version     0.2.2
// @author      -
// @description Handle mouse wheel events to navigate videos
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/wheel-video-navigator.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/wheel-video-navigator.user.js
// @license     MIT
// ==/UserScript==

(function() {
    'use strict';

    const skipTime = 1 / 60; // Time to skip in seconds

    function findVideoAtPoint(x, y) {
        const hitElements = document.elementsFromPoint(x, y);
        const hitVideo = hitElements.find(element => element instanceof HTMLVideoElement);
        if (hitVideo) {
            return hitVideo;
        }

        return Array.from(document.querySelectorAll('video')).find(video => {
            const rect = video.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 &&
                x >= rect.left && x <= rect.right &&
                y >= rect.top && y <= rect.bottom;
        });
    }

    document.addEventListener('wheel', event => {
        if (event.deltaY === 0 || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
            return;
        }

        const video = findVideoAtPoint(event.clientX, event.clientY);
        if (!video) {
            return;
        }

        event.preventDefault();
        if (!video.paused) {
            video.pause();
        }
        video.currentTime += event.deltaY < 0 ? skipTime : -skipTime;
    }, { passive: false });
})();
