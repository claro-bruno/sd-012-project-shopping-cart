const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const PRODUCT_ERROR_MESSAGE = 'Ops, o produto não foi encontrado :(';
const itemsSection = document.querySelector('.items');

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');

  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  // itemsSection.appendChild(section);

  return section;
};

const productList = (object) => {
  object.forEach((element) => itemsSection.appendChild(createProductItemElement(element)));
};

const fetchProduct = async () => {
  try {
    const response = await fetch(BASE_URL);
    const { results } = await response.json();
    productList(results);
  } catch (error) {
    alert(PRODUCT_ERROR_MESSAGE);
  }
};

// const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

// const cartItemClickListener = (event) => {
//   // coloque seu código aqui
// };

// const createCartItemElement = ({ id: sku, title: name, salePrice }) => {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// };

window.onload = function onload() {
  fetchProduct();
};