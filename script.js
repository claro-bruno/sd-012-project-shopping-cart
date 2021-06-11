const END_POINT_ALL_COMPUTERS = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

const END_POINT_ID_COMPUTER = 'https://api.mercadolibre.com/items/';

const cartList = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getIdItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const hideLoadingText = () => {
  const loadingText = document.querySelector('.loading');
  const parent = loadingText.parentNode;
  parent.removeChild(loadingText);
};

const reloadTotalPrice = () => {
  let cartItems = document.querySelectorAll('.cart__item');

  cartItems = Object.values(cartItems);
  const totalPrice = cartItems.reduce((acc, curr) => {
    const accPrice = acc + Number(curr.innerHTML.split('$')[1]);
    return accPrice;
  }, 0);

  const spanTotalPrice = document.querySelector('.total-price');
  spanTotalPrice.innerHTML = totalPrice;
};

const saveLocalStorage = () => {
  localStorage.setItem('cartShopping', cartList.innerHTML);
};

const loadCartList = () => {
  cartList.innerHTML = localStorage.getItem('cartShopping');
};

const clearCart = () => {
  localStorage.clear();
  loadCartList();
  reloadTotalPrice();
};

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.remove();
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendComputers = (computers) => {
  const sectionItems = document.querySelector('.items');
  computers.forEach((computer) => {
    const { id, title, thumbnail } = computer;
    const newSection = createProductItemElement({ id, title, thumbnail });
    sectionItems.appendChild(newSection);
  });
};

const appendCartComputers = (computer) => {
  const { id, title, price } = computer;
  cartList.appendChild(createCartItemElement({ id, title, price }));
  reloadTotalPrice();
};

const fetchAPI = async (endPoint) => {
  try {
    const response = await fetch(endPoint);
    const object = await response.json();
    if (endPoint === END_POINT_ALL_COMPUTERS) {
      appendComputers(object.results);
      hideLoadingText();
    } else {
      appendCartComputers(object);
      saveLocalStorage();
    }
  } catch (error) {
    console.log(error);
  }
};

const listener = (event) => {
  if (event.target.classList.contains('item__add')) {
    const computer = event.target.parentNode;
    fetchAPI(END_POINT_ID_COMPUTER + getIdItem(computer));
  } else if (event.target.classList.contains('cart__item')) {
    cartItemClickListener(event);
    reloadTotalPrice();
  } else if (event.target.classList.contains('empty-cart')) {
    clearCart();
  } else {
        // se não, exclua esse evento dos registros
        event.target.removeEventListener('click', listener);
    }
};

const setupEvents = () => {
  document.addEventListener('click', listener);
};

window.onload = () => {
  setupEvents();
  fetchAPI(END_POINT_ALL_COMPUTERS);
  loadCartList();
  reloadTotalPrice();
};
