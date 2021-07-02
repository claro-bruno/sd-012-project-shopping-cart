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

 function cartItemClickListener(event) {
  console.log(event);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} 

function click() {
  const botoes = document.querySelectorAll('.item__add');
  const lista = document.querySelector('.cart__items');
  botoes.forEach((botao) => {
    const IdName = getSkuFromProductItem(botao.parentNode);   
    botao.addEventListener('click', () => fetch(`https://api.mercadolibre.com/items/${IdName}`)
      .then((response) => response.json())
      .then((product) => lista.appendChild(createCartItemElement(product)))
      .then((xablau) => console.log(xablau)));
  });
}

window.onload = function onload() {
  const sectionItem = document.querySelector('.items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => (response.json()))
    .then((promise) => (promise.results))
    .then((array) => {
      array.forEach((dados) => {
        sectionItem.appendChild(createProductItemElement(dados));
      });
    })
    .then(() => click());
};
