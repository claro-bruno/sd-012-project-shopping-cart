
function getObject(item) {
  return console.log(item);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const pai = document.querySelector('#carrinhoVazio');
  pai.removeChild(event.target);
}
function createCartItemElement(elemento) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = 'liId';
  li.innerText = `SKU: ${elemento.id} | NAME: ${elemento.title} | PRICE: $${elemento.price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement(elemento) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', elemento.id));
  section.appendChild(createCustomElement('span', 'item__title', elemento.title));
  section.appendChild(createProductImageElement(elemento.thumbnail));
  const btnCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnCart.addEventListener('click', () => {
    const ol = document.querySelector('#carrinhoVazio');
    ol.appendChild(createCartItemElement(elemento));
  });
  section.appendChild(btnCart);
  
  return section;
}
async function returnFetch(search) {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
   const json = await response.json();
   const entries = Object.values(json.results);
   entries.forEach((elemento) => {
   const section = document.querySelector('.items');
  section.appendChild(createProductItemElement(elemento));
   });
}
window.onload = function onload() {
 returnFetch('computador');
};
