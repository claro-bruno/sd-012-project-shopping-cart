window.onload = function onload() { 
  fetchInfo();
};

const apiLink = "https://api.mercadolibre.com/sites/MLB/search?q=computador";
const results = [];
const itemExample = {
  id: "MLB1218701240",
  title: "Computador Pc Completo Intel 8gb Hd 500gb Monitor 18 Wind 10",
  thumbnail: "http://http2.mlstatic.com/D_817225-MLB45400911410_032021-I.jpg",
}

const fetchInfo = () => {
  const list = {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  };

  return fetch(apiLink, list)
    .then(response => response.json())
    .then(data => {
      return data.results.map((item) => createProductItemElement(item)); // results.push(item)
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const items = document.querySelector('.items');
  items.appendChild(section);

  // return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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
// VQV
