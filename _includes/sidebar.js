(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  function toggleSidebar(e) {
    var target = e.target;

    if(!checkbox.checked ||
      sidebar.contains(target) ||
      (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }

  document.addEventListener('click', toggleSidebar, false);
  document.addEventListener('touchstart', toggleSidebar, false);

  // De-obfuscate email addresses.
  var obfAnchors = document.querySelectorAll('[data-obf]');
  obfAnchors = [].slice.call(obfAnchors);
  for (var i = 0, s = ''; i < obfAnchors.length; i++) {
    s = obfAnchors[i].getAttribute('data-obf').split('').reverse().join('');
    obfAnchors[i].textContent = s;
    if (obfAnchors[i].href) obfAnchors[i].href = 'mailto:' + s;
  }
})(document);
