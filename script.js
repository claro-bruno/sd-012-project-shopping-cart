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
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

function cartItemClickListener(event) {
  const carrinho = document.querySelector('ol');
  carrinho.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const addCart = async (sku) => {
  let request = await fetch(`https://api.mercadolibre.com/items/${sku}`);
   request = await request.json();
   const ol = document.querySelector('.cart__items');
   ol.appendChild(createCartItemElement(request));
 };

const callbutton = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((button) => {
    (button.addEventListener('click', (event) => {
      const iten = event.target.parentElement.firstChild.innerText;
      addCart(iten);
    }));
  });
};

const fetchML = () => {
  const Itens = document.querySelector('.items');
  fetch(apiMercadoLivre)
  .then((Rsp) => Rsp.json())
  .then((ar) => ar.results.forEach((prd) => Itens.appendChild(createProductItemElement(prd))))
  .then(() => callbutton());
 // acompanhei a logica do jose carlos perante a eplicação do ronald no plantão. 
};

window.onload = function onload() {
  fetchML();
};