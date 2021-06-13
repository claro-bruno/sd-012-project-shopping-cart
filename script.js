const getSectionProducts = document.querySelector('.items');
const getOlCartProducts = document.querySelector('.cart__items');

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

const createLoading = () => {
  getSectionItems.appendChild(createCustomElement('p', 'loading', 'loading...'));
};

const createTotalPrice = () => {
  const getSectionCart = document.querySelector('.cart');
  getSectionCart.appendChild(createCustomElement('footer', 'total-price', 'Preço Total:'));
};

const sumPrices = () => {
  const turnCartItensIntoArray = Array(...document.querySelectorAll('.cart__item'));
  const getTotalPrices = document.querySelector('.total-price');
  const sumTotalPrices = turnCartItensIntoArray.reduce((acc, price) => 
  acc + Number(price.innerText.split('$')[1]), 0);
  getTotalPrices.innerText = sumTotalPrices;
};

const addClearEventToButtonCart = () => {
  const getButtonCart = document.querySelector('.empty-cart');
  getButtonCart.addEventListener('click', () => {
  getOlCartItems.innerHTML = null;
  sumPrices();
  });
}; //estamos aqui

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
