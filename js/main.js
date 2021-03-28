const mySwiper = new Swiper('.swiper-container', {
  loop: true,
  
	// Navigation arrows
	navigation: {
    nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// КОРЗИНА

// получили элементы для открытия модального окна
const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');
// получили элементы для товаров
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const buttonClothing = document.querySelector('.button-clothing');
const buttonAccessories = document.querySelector('.button-accessories');
// получили элементы для корзины
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const clearCart = document.querySelector('.clear-cart');

// функция получения товаров с сервера
const getGoods = async () => {
  const result = await fetch('db/db.json');
  if (!result.ok) {
    throw 'Ошибка:' + result.status
  }
  return await result.json();
};

const cart = {
  cartGoods: [],

  renderCart(){
    cartTableGoods.textContent = '';
    this.cartGoods.forEach(({id, name, price, count}) => {
      const trGood = document.createElement('tr');
      trGood.className = 'cart-item';
      trGood.dataset.id = id;
      trGood.innerHTML = `
        <td>${name}</td>
        <td>${price}$</td>
        <td><button class="cart-btn-minus">-</button></td>
        <td>${count}</td>
        <td><button class="cart-btn-plus">+</button></td>
        <td>${price * count}$</td>
        <td><button class="cart-btn-delete">x</button></td>
      `;
      cartTableGoods.append(trGood);
    });
    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + (item.price * item.count);
    }, 0);
    cardTableTotal.textContent = totalPrice + '$'


    const totalCart = this.cartGoods.reduce((sum, item) => {
      return sum + item.count;
    }, 0);
    if (totalCart === 0) {
      cartCount.textContent = '';
    } else {
    cartCount.textContent = totalCart
    }



  },

  deleteGood(id){
    this.cartGoods = this.cartGoods.filter(item => id !== item.id);
    this.renderCart();
  },

  minusGood(id){
      for (const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id)
        } else {
          item.count--;
        }
        break;
      }
    }
    this.renderCart()
  },

  plusGood(id){
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count++;
        break;
      }
    }
    this.renderCart()
  },

  addCartGoods(id){
    const goodItem = this.cartGoods.find(item => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
        .then(data => data.find(item => item.id === id))
        .then(({ id, name, price }) => {
          this.cartGoods.push({
            id,
            name,
            price,
            count: 1
          });
          this.renderCart()
        });
    }
  },

  clearCartGoods() {
    this.cartGoods.length = 0;
    cart.renderCart();
  },
}

document.body.addEventListener('click', event => {
  const addToCart = event.target.closest('.add-to-cart');
  if (addToCart) {
    cart.addCartGoods(addToCart.dataset.id);
  }
});

clearCart.addEventListener('click', () => {
  cart.clearCartGoods();
})

cartTableGoods.addEventListener('click', event => {
  const target = event.target;
  if (target.tagName === "BUTTON") {
    const id = target.closest('.cart-item').dataset.id;
    if (target.classList.contains('cart-btn-delete')) {
      cart.deleteGood(id);
    };
    if (target.classList.contains('cart-btn-minus')) {
      cart.minusGood(id);
    };
    if (target.classList.contains('cart-btn-plus')) {
      cart.plusGood(id);
    };
  }

});

// открытие модального окна
const openModal = () => {
  cart.renderCart();
  modalCart.classList.add('show');
	document.addEventListener('keydown', escapeKey)
};

// закрытие модального окна
const closeModal = () => {
	modalCart.classList.remove('show');
	document.removeEventListener('keydown', escapeKey)
};

// закрытие по клавише Escape
const escapeKey = (event) => {
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
		scrollLink.addEventListener('click', event => {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}

// ТОВАРЫ

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
more.addEventListener('click', event => {
  event.preventDefault();
  getGoods().then(renderCards)
});

// фильтр карточек и вывод на страницу
const filterCards = function(field, value) {
  getGoods()
    .then(data => data.filter(good => good[field] === value))
    .then(renderCards);
};

// перебор навигационного меню и по клику получение нужных карточек
navigationLink.forEach(function(link) {
  link.addEventListener('click', event => {
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
buttonClothing.addEventListener('click', event => {
  event.preventDefault();
  filterCards ("category", "Clothing");
});

// показ аксессуаров по нажатию кнопки 
buttonAccessories.addEventListener('click', event => {
  event.preventDefault();
  filterCards ("category", "Accessories")
});


//отправка формы

const modalForm = document.querySelector('.modal-form');
const modalInput = document.querySelectorAll('.modal-input');

const postData = dataUser => fetch('server.php', {
  method: 'POST',
  body: dataUser,
});

modalForm.addEventListener('submit', event => {
  event.preventDefault();
  
  const formData = new FormData(modalForm);
  formData.append('cart', JSON.stringify(cart.cartGoods));
  
  if (cart.cartGoods.length === 0){
    alert('Ошибка: корзина пустая!')
  }

  let check = "true"
  modalInput.forEach((input) => {
    const value = input.value
    if (value.trim() === '') {
      check = "false"
    }
  })

  if (check === "false") {
    alert('Ошибка: неверно указаны имя или телефон')
  }

  if (cart.cartGoods.length != 0 && check == "true") {
    postData(formData)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        alert('Ваш заказ успешно отправлен, с вами свяжутся в ближайшее время')
        console.log(response.statusText);
      })
      .catch(err => {
        alert('Ошибка отправки формы, повторите позже');
        console.error(err)
      })
      .finally(() => {
        closeModal();
        modalForm.reset();
        cart.cartGoods.length = 0;
        cart.renderCart();
      });
  }
});