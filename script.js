const totalPrice = document.querySelector('.total-price');
const ol = document.querySelector('.cart__items');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const sumValues = () => {
  const itens = document.querySelectorAll('.cart__item');
  let total = 0;
  itens.forEach((item) => {
    const arr = item.innerHTML.split(' ');
    arr.forEach((value) => {
      if (value.includes('$')) {
        const valueArr = value.split('');
        const sum = Number(valueArr.filter((letter) => letter !== '$').join(''));
        total += sum;
        totalPrice.innerHTML = total;
      }
    });
  });
};

function cartItemClickListener(event) {
  const olCartItem = document.querySelector('.cart__items');
  localStorage.removeItem(event.target.innerHTML);
  olCartItem.removeChild(event.target);
  sumValues();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getFetchML = async () => {
  const items = document.querySelector('.items');
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const ob = await response.json();
  const result = ob.results;
  return result.forEach((computer) => {
    items.appendChild(createProductItemElement(computer));
  });
};

const savedStorage = () => {
  localStorage.setItem('.cart', ol.innerHTML);
  sumValues();
};

const loadStorage = () => {
  const load = localStorage.getItem('.cart');
  if (load) {
    ol.innerHTML = load;
    ol.childNodes.forEach((loaded) => loaded.addEventListener('click', cartItemClickListener));
  }
};

const fetchID = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const ob = await response.json();
  ol.appendChild(createCartItemElement(ob));
  savedStorage();
};

const addButtonCart = () => {
  const buttonCart = document.querySelectorAll('.item__add');
  buttonCart.forEach((button) => {
    button.addEventListener('click', () => {
      const getID = button.parentNode.firstChild.innerText;
      fetchID(getID);
    });
  });
};

const clearShop = () => {
  const clearButtonCart = document.querySelector('.empty-cart');
  clearButtonCart.addEventListener('click', () => {
    ol.innerHTML = '';
  localStorage.clear();
  sumValues();
  });
};

window.onload = async function onload() {
  await getFetchML();
  await addButtonCart();
  await sumValues();
  await clearShop();
  await loadStorage();
};
