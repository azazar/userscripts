// ==UserScript==
// @name        Dump links
// @namespace   Azazar's Scripts
// @version     1.2.0
// @author      -
// @description Dump all external links and images
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @updateURL   https://raw.githubusercontent.com/azazar/userscripts/main/dump-links.user.js
// @downloadURL https://raw.githubusercontent.com/azazar/userscripts/main/dump-links.user.js
// @license     MIT
// ==/UserScript==

function sanitizeHost(host) {
  if (host.substring(0, 4) === 'www.') {
    host = host.substring(4);
  }

  return host;
}

function endsWith(str, wth) {
  return str.length >= wth.length && str.substring(str.length - wth.length) === wth;
}

function isExternal(url) {
  let host = sanitizeHost(location.host);

  let a = document.createElement('A');
  a.href = url;
  let link_host = sanitizeHost(a.host);

  if (host === link_host || endsWith(host, '.' + link_host) || endsWith(link_host, '.' + host)) {
    return false;
  }

  return true;
}

function getLinks() {
  let res = {};

  let links = [];
  Array.from(document.querySelectorAll('a[href]')).forEach(a => {
    if (isExternal(a.href)) {
      links.push(a.href);
    }
  });

  res['anchors'] = links;

  let ae = document.createElement('A');

  links = [];
  Array.from(document.querySelectorAll('img[src]')).forEach(a => {
    ae.href = a.src;
    if (isExternal(ae.href)) {
      links.push(ae.href);
    }
  });

  res['images'] = links;

  links = [];
  Array.from(document.querySelectorAll('*')).forEach(element => {
    let backgroundImage = getComputedStyle(element).backgroundImage;
    Array.from(backgroundImage.matchAll(/url\(["']?(.+?)["']?\)/g)).forEach(match => {
      ae.href = match[1];
      if (isExternal(ae.href) && !links.includes(ae.href)) {
        links.push(ae.href);
      }
    });
  });

  res['cssImages'] = links;

  links = [];
  Array.from(document.querySelectorAll('video[src]')).forEach(v => {
    ae.href = v.src;
    if (isExternal(ae.href)) {
      links.push(ae.href);
    }
  });

  res['videos'] = links;

  return res;
}

function buildSection(title, values) {
  if (values.length === 0) {
    return '';
  }

  return '# ' + title + ":\n\n - " + values.join("\n - ") + "\n\n";
}

function getLinksStr() {
  let links = getLinks();
  let message =
    "Page URL: " + location.href + "\n\n" +
    buildSection("Anchors", links['anchors']) +
    buildSection("Images", links['images']) +
    buildSection("CSS Images", links['cssImages']) +
    buildSection("Videos", links['videos']);

  return message;
}

function dumpLinks() {
  console.log(getLinksStr());
}

function copyLinks() {
  GM_setClipboard(getLinksStr());
}

let suffix = '';

if (window.top != window.self) {
  suffix = ' (' + location.host + location.pathname + ')';
}


GM_registerMenuCommand("Dump External Links to Console" + suffix, dumpLinks);
GM_registerMenuCommand("Copy External Links to Clipboard" + suffix, copyLinks);
