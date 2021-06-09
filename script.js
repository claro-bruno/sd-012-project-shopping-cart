function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItems = async (id) => {
  const itemObj = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const itemJson = await itemObj.json();
  const item = createCartItemElement(itemJson);
  document.getElementsByClassName('cart__items')[0].appendChild(item);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      const id = event.target
        .parentElement
        .firstChild
        .innerText;
      fetchItems(id);
    });
  }
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

const fetchApi = async () => {
  const promiseFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json());
  console.log(promiseFetch);
  promiseFetch.results.forEach((element) => {
    const item = createProductItemElement(element);
    document.getElementsByClassName('items')[0].appendChild(item); 
  });
};

window.onload = function onload() {
  fetchApi();  
};