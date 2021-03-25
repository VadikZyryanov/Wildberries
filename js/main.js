const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// корзина

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

// открытие модального окна
const openModal = function() {
	modalCart.classList.add('show');
	document.addEventListener('keydown', escapeKey)
};

// закрытие модального окна
const closeModal = function() {
	modalCart.classList.remove('show');
	document.removeEventListener('keydown', escapeKey)
};

// закрытие по клавише Escape
const escapeKey = function(event) {
	const keyCode = event.code
	if (keyCode === "Escape") {
		closeModal();
	}
};

buttonCart.addEventListener('click', openModal)
modalClose.addEventListener('click', closeModal)

// открытие по клику в любое место вне модального окна
modalCart.addEventListener('click', (event) => {
	const target = event.target
	if (target.classList.contains('show')) {
		closeModal();
	};
});


// скролл наверх по кнопке

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', function(event) {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}

// товары

// получили элементы
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const buttonClothing = document.querySelector('.button-clothing');
const buttonAccessories = document.querySelector('.button-accessories');

// функция получения товаров с сервера
const getGoods = async function() {
  const result = await fetch('db/db.json');
  if (!result.ok) {
    throw 'Ошибка:' + result.status
  }
  return await result.json();
};

// функция создает карты
const createCard = function({label, name, img, description, id, price }) {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-sm-6'
  card.innerHTML = `
    <div class="goods-card">
      ${label ? `<span class="label">${label}</span>` : '' }
      
      <img src="db/${img}" alt="${name}" class="goods-image">
      <h3 class="goods-title">${name}</h3>
      <p class="goods-description">${description}</p>
      <button class="button goods-card-btn add-to-cart" data-id="${id}">
        <span class="button-price">$${price}</span>
      </button>
    </div>
  `;

  return card
};

// вывод карточек на страницу
const renderCards = function(data) {
  longGoodsList.textContent = '';
  const cards = data.map(createCard)
  longGoodsList.append(...cards)
  document.body.classList.add('show-goods')
};

// вывод товаров с сервера по клику на кнопку
more.addEventListener('click', function(event) {
  event.preventDefault();
  getGoods().then(renderCards)
});

// фильтр карточек и вывод на страницу
const filterCards = function(field, value) {
  getGoods()
    .then(function(data) {
      const filterGoods = data.filter(function(good) {
        return good[field] === value
      });
      return filterGoods;
    })
    .then(renderCards);
};

// перебор навигационного меню и по клику получение нужных карточек
navigationLink.forEach(function(link) {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const field = link.dataset.field
    const value = link.textContent;
    filterCards (field, value);
    if (value === "All") {
      getGoods().then(renderCards)
    }
  })
});

// показ одежды по нажатию кнопки
buttonClothing.addEventListener('click', function(event) {
  event.preventDefault();
  filterCards ("category", "Clothing");

  const id = buttonClothing.getAttribute('href');
  document.querySelector(id).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
});

// показ аксессуаров по нажатию кнопки 
buttonAccessories.addEventListener('click', function(event) {
  event.preventDefault();
  filterCards ("category", "Accessories");

  const id = buttonAccessories.getAttribute('href');
  document.querySelector(id).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
});