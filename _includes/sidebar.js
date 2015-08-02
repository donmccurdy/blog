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
})(document);
