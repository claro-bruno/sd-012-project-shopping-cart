const loadingScreen = () => {
  const text = document.querySelector('.loading');
  text.remove();
};

const deleteAllCart = () => {
  const button = document.querySelector('.empty-cart');
  const cart = document.querySelector('.cart__items');

  button.addEventListener('click', () => {
    if (cart.firstChild) {
      while (cart.firstChild) {
        cart.removeChild(cart.firstChild);
      }
      localStorage.removeItem('cart');
    }
  });
};

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

const renderTotalPrice = (price) => {
  const place = document.querySelector('.total-price');
  place.innerText = price;
};

const setTotalPrice = () => {
  const allCartItems = document.querySelectorAll('.cart__item');
  const allPrices = [];
  allCartItems.forEach((current) => {
    const split = current.innerText.split(' ');
    const price = split[split.length - 1];
    allPrices.push(parseFloat(price.replace('$', '')));
  });
  renderTotalPrice(allPrices.reduce((accumulator, current) => accumulator + current, 0));
};

const saveInLocalStorage = () => {
  const allCartItems = document.querySelectorAll('.cart__item');
  const arrayAllCart = [];

  allCartItems.forEach((currentCart) => {
    const split = currentCart.innerText.split(' ');
    arrayAllCart.push({
      cartClass: currentCart.classList,
      id: split[1],
    });
  });
  localStorage.setItem('cart', JSON.stringify(arrayAllCart));
};

function cartItemClickListener(event) {
  event.target.remove();
  saveInLocalStorage();
  setTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;

  fetch(url)
    .then((response) => response.json())
    .then((obj) => {
      const { id: sku, title: name, price: salePrice } = obj;

      const cartSection = document.querySelector('.cart__items');
      cartSection.appendChild(createCartItemElement({ sku, name, salePrice }));
      saveInLocalStorage();
      setTotalPrice();
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  button.addEventListener('click', () => {
    addToCart(sku);
  });

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

const renderAllProducts = (array) => {
  const sectionItems = document.querySelector('.items');

  array.results.forEach((current) => {
    const { id: sku, title: name, thumbnail: image } = current;

    sectionItems.appendChild(createProductItemElement({ sku, name, image }));
  });
};

window.onload = function onload() {
  const cartLocalStorage = JSON.parse(localStorage.getItem('cart'));

  deleteAllCart();

  if (cartLocalStorage && cartLocalStorage.length > 0) {
    cartLocalStorage.forEach((current) => addToCart(current.id));
  }

  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computer';

  fetch(url)
    .then((response) => response.json())
    .then((array) => {
      renderAllProducts(array);
      loadingScreen();
    });
};
