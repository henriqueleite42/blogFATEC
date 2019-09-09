var h = document.getElementsByTagName('head')[0];
//init styles
h.innerHTML += '<link rel="stylesheet" type="text/css" href="css/main.css">';
h.innerHTML += '<link href="css/includes/fontawesome/css/all.css" rel="stylesheet">';

$(document).ready(function () {
	//init layout
	$('#main-header').load('html/includes/main-header.html');
	$('#nav-menu').load('html/includes/nav-menu.html');
	changeFeatured();
});

function changeFeatured() {
	var post = [{
			title: 'Title IIII',
			content: 'Text I',
			bg: 'bg1.jpg',
			dt: 'Date I',
			url: 'mypost.html'
		},
		{
			title: 'Title II',
			content: 'Text II',
			bg: 'bg2.jpg',
			dt: 'Date II',
			url: 'mypost.html'
		},
		{
			title: 'Title III',
			content: 'Text III',
			bg: 'bg3.jpg',
			dt: 'Date III',
			url: 'mypost.html'
		}
	];

	post.forEach(function (p) {
		let selectorHolder = document.createElement('label');
		selectorHolder.setAttribute('tabindex', '0');			

		let inputHolder = document.createElement('input');
		inputHolder.setAttribute('type', 'radio');
		inputHolder.setAttribute('name', 'selec');
		selectorHolder.appendChild(inputHolder);

		let divHolder = document.createElement('div');
		divHolder.setAttribute('class', 'selector');
		divHolder.appendChild(document.createElement('div'));
		selectorHolder.appendChild(divHolder);

		inputHolder.addEventListener('change', function () {
			$('#featured').stop();
			$('#featured').fadeOut(0);
			$('#featured').fadeIn(500);

			$('.feat-bg img').attr('src', 'img/' + p.bg);
			$('.feat-bg img').attr('alt', p.title);
			$('.feat-bg img').attr('title', p.title);

			$('.feat-date p').html(p.dt);
			$('.feat-title').html(p.title);
			$('.feat-content').html(p.content);
			$('.feat-read').attr('href', 'html/' + p.url);
		});

		$('.feat-selector').append(selectorHolder);
		if (post.indexOf(p) === 0) selectorHolder.click();
	});
}

function displaySubmenu(obj) {
	if($(window).width() > 1080) return;
	let par = obj.parentNode.parentNode;

	let showmenuController = par.querySelector('.showmenu-controller');
	showmenuController.checked = obj.checked;	
}

/* $(window).bind('scroll', function () {
	 console.log($('#main-header').css('marginBottom'));

	if ($(window).scrollTop() > $('#main-header').height()) {
		$('#nav-menu').addClass('fixed');
		$('#main-header').css('marginBottom', $('#nav-menu').height() +'px');
	} else {
		$('#nav-menu').removeClass('fixed');
		$('#main-header').css('marginBottom', '0');
	} 
}); */