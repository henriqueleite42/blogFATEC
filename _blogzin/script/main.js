var h = document.getElementsByTagName('head')[0];
//init styles
h.innerHTML += '<link rel="stylesheet" type="text/css" href="css/main.css">';
h.innerHTML += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';

$(document).ready(function () {
	//init layout
	$('#main-header').load('html/includes/main-header.html');
	$('#nav-menu').load('html/includes/nav-menu.html');

	changeFeatured();
});

function changeFeatured() {
	var post = [{
			title: 'Title I',
			content: 'Text I',
			bg: 'bg1.jpg',
			dt: 'Date I'
		},
		{
			title: 'Title II',
			content: 'Text II',
			bg: 'bg2.jpg',
			dt: 'Date II'
		},
		{
			title: 'Title III',
			content: 'Text III',
			bg: 'bg.jpg',
			dt: 'Date III'
		}
	];

	post.forEach(function (p, i) {
		$.get('html/templates/toggle-featured.html', function (data) {
			$('.feat-selector').append(data);
		});

		setTimeout(function () {
			let s = document.querySelectorAll('input[name="selec"]')[i];
			s.onclick = function () {
				$('#featured').stop();
				$('#featured').fadeOut(0);
				$('#featured').fadeIn(500);

				$('.feat-bg img').attr('src', 'img/' + p.bg);
				$('.feat-bg img').attr('alt', p.title);
				$('.feat-bg img').attr('title', p.title);

				$('.publish-date p').html(p.dt);
				$('.feat-title').html(p.title);
				$('.feat-content').html(p.content);
			}

			if (post.indexOf(p) == 0) s.click();
		}, 20);
	});




}