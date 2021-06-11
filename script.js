const ol = document.querySelector('.cart__items');
const clean = document.querySelector('.empty-cart');

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
const toLocalStorage = () => {
 localStorage.setItem('item', ol.innerHTML);
};

const soma = () => {
  const myarray = document.querySelectorAll('.cart__item');
  let acc = 0;
  myarray.forEach((ele) => {
    const n1 = Number(ele.innerHTML.slice(ele.innerHTML.indexOf('$') + 1));
    acc += n1;
  });
   const total = document.querySelector('.total-price');
   total.innerText = acc;     
};

function cartItemClickListener(event) {
 event.target.remove();
  toLocalStorage();
  soma();
}
// obtive ajuda do Daivid Gonzaga https://github.com/tryber/sd-012-project-shopping-cart/pull/39

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
   ol.appendChild(createCartItemElement(request));
 };

const callbutton = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((button) => {
    (button.addEventListener('click', async (event) => {
      const iten = event.target.parentElement.firstChild.innerText;
      await addCart(iten);
      soma();
      toLocalStorage();
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

const clearcart = () => {
  ol.innerHTML = '';
  soma();
};
clean.addEventListener('click', clearcart);

window.onload = function onload() {
  fetchML();
  ol.innerHTML = localStorage.getItem('item');
  ol.childNodes.forEach((elm) => elm.addEventListener('click', cartItemClickListener));
  soma();
};