const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const openModal = function() {
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeKey)
};

const closeModal = function() {
	modalCart.classList.remove('show');
	document.removeEventListener('keydown', escapeKey)
};

const escapeKey = function(event) {
	const keyCode = event.code
	if (keyCode === "Escape") {
		closeModal();
	}
};

buttonCart.addEventListener('click', openModal)
modalClose.addEventListener('click', closeModal)

modalCart.addEventListener('click', (event) => {
	const target = event.target
	if (target.classList.contains('show')) {
		closeModal();
	};
});


// scroll smooth

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (let i = 0; i < scrollLinks.length; i++) {
		scrollLinks[i].addEventListener('click', function(event) {
			event.preventDefault();
			const id = scrollLinks[i].getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}