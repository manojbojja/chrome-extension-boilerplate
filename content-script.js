function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
$( document ).ready(function() {
    injectScript(chrome.extension.getURL('inject.js'), 'body');
});
