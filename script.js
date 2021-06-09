const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const apiRequest = () => fetch(api).then((response) => response.json());

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
  });
} catch (err) {
  console.log('Erro na requisição');
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  listItens(); 
};