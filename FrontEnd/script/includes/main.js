var h = document.getElementsByTagName('head')[0];
h.innerHTML += '<link rel="stylesheet" type="text/css" href="css/includes/root.css">'
h.innerHTML += '<link rel="stylesheet" type="text/css" href="css/includes/main.css">';
h.innerHTML += '<link href="css/includes/fontawesome/css/all.css" rel="stylesheet">';
$(document).ready(function () {
	layout_init();
});

function layout_init() {
	function show_cat() {
		$('.cat-holder').height(
			($('.cat').outerHeight() * $('#show-cat').prop('checked'))
		);

		document.querySelectorAll('.cat .cat-item .cat-desc a').forEach(a => {
			var r = a.setAttribute('tabindex', $('#show-cat').prop('checked') * 3 - 1);
		});
	}

	$('#nav-main').load('html/includes/nav-main.html', () => {
		init_cat();

		$('#show-cat').change(() => {
			show_cat();
		});

		$(window).resize(() => {
			show_cat();
		});

		$('.show-cat-label').keypress(function (event) {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode == '13') {
				$('.show-cat-label').click();
			}
			event.stopPropagation();
		});
	});
}

function init_cat() {
	var mJson = [{
			name: 'Doces',
			img: 'doces.jpg',
			recipes: 37,
			url: 'html/cat/doces.html'
		},{
			name: 'Doces',
			img: 'doces.jpg',
			recipes: 37,
			url: 'html/cat/doces.html'
		},{
			name: 'Doces',
			img: 'doces.jpg',
			recipes: 37,
			url: 'html/cat/doces.html'
		},{
			name: 'Doces',
			img: 'doces.jpg',
			recipes: 37,
			url: 'html/cat/doces.html'
		},{
			name: 'Doces',
			img: 'doces.jpg',
			recipes: 37,
			url: 'html/cat/doces.html'
		}
	];

	mJson.forEach(cat => {
		let cat_item = $('<div></div>').load('html/templates/cat-item.html', () => {
			cat_item.addClass('cat-item');
			cat_item.children('a').prop('href', cat.url);
			cat_item.find('img')
				.prop('src', 'img/cat/' + cat.img)
				.prop('title', 'Categoria ' + cat.name)
				.prop('alt', cat_item.find('img').prop('title'))
				.on('error', () => {
					let pad = cat_item.find('.cat-desc').css('transform').replace(/[^0-9\-.,]/g, '').split(',');
					console.log(pad);
					
					cat_item.css('padding-right', (pad[4]*-1)+'px')
					cat_item.children('a').remove();
					cat_item.find('.cat-desc')
						.css('padding-left', cat_item.find('.cat-desc').css('padding-right'))
						.css('transform', 'none');
				});
			cat_item.find('.cat-name')
				.html(cat.name)
				.prop('href', cat.url);
			cat_item.find('.cat-recipes').html(cat.recipes + ' Receitas');
		});
		$('.cat').append(cat_item);
	});
}