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
function cartItemClickListener(event, { id, title, price }) {
  const adress = document.querySelector('.cart__items');
  const li = document.createElement('li');
  adress.appendChild(li);
  li.innerText = `SKU:${id} | NAME:${title} | PRICE: R$${price},00`;
}

function createProductItemElement(elemento) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', elemento.id));
  section.appendChild(createCustomElement('span', 'item__title', elemento.title));
  section.appendChild(createProductImageElement(elemento.thumbnail));
  const btnCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnCart.addEventListener('click', () => {
    cartItemClickListener(section, elemento);
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
