const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const apiRequest = () => fetch(api).then((response) => response.json());
const cartItems = '.cart__items';
const apiItemId = 'https://api.mercadolibre.com/items';

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

function cartItemClickListener() {
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2
const addToCart = () => {
  const cartItem = document.querySelector(cartItems);
  const addToCartBtn = document.querySelectorAll('.item__add');
  addToCartBtn.forEach((item) => {
    item.addEventListener('click', () => {
      const itemId = item.parentNode.firstChild.innerText;
      fetch(`${apiItemId}/${itemId}`)
      .then((response) => response.json())
      .then((product) => {
        const productInfo = { sku: product.id, name: product.title, salePrice: product.price };
        const productToCart = createCartItemElement(productInfo);
        cartItem.appendChild(productToCart);
      });
    });
  });
};

// Requisito 1
const listItens = async () => {
  try {
    await apiRequest().then((item) => {
      const loading = document.querySelector('.loading');
      const items = document.querySelector('.items');
      items.removeChild(loading);
    const productContainer = document.querySelector('.items');
    item.results.map((product) => {
      const productDetails = { sku: product.id, name: product.title, image: product.thumbnail };
      const productElement = createProductItemElement(productDetails);
      return productContainer.appendChild(productElement);    
  });
  }).then(() => addToCart());
} catch (err) {
  console.log('Erro na requisição');
  }
};

window.onload = function onload() {
  listItens(); 
};