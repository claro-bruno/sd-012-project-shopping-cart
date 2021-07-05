const listadeProdutos = async (item) => {
  const ApiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=${item}';
  const api = await fetch(ApiUrl);
  const apiJson = await api.json();
  const arrayResults = apiJson.results;
  await arrayResults.forEach((item) => items[0].appendChild(createProductItemElement(item)));
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

function createProductItemElement({ sku, name, image }) {
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


function cartItemClickListener(event) {
  const text = event.target.innerText;
  const valor = parseFloat(text.split('$')[1]);
  const total = document.querySelector('.total-price').innerText;
  const totalF = total - valor;
  document.querySelector('.total-price').innerText = totalF;
  event.target.remove();
  saveCartItemToLocalStorage();
}// coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() { };