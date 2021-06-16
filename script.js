const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const PRODUCT_URL = 'https://api.mercadolibre.com/items/';
const itemsSection = document.querySelector('.items');
const cartsSection = document.querySelector('.cart__items');

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

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = async (event) => {
  // coloque seu código aqui
  event.target.remove();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getItemFromAPI = async () => {
  try {
    const response = await fetch(BASE_URL);
    const { results } = await response.json();
    results.forEach((item) => {
      const itemDetails = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      itemsSection.appendChild(createProductItemElement(itemDetails));
    });
  } catch (error) {
    return error;
  }
};

const selectItemToCart = () => {
  itemsSection.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const element = event.target.parentElement;
      const sku = getSkuFromProductItem(element);
      fetch(`${PRODUCT_URL}${sku}`)
        .then((response) => response.json())
        .then((data) => {
          const itemKey = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          cartsSection.appendChild((createCartItemElement(itemKey)));
        });
    }
  });
};

const productList = (object) => {
  object.forEach((element) => itemsSection.appendChild(createProductItemElement(element)));
}; 

window.onload = function onload() {
  getItemFromAPI();
  selectItemToCart();
};  