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
const computers = () => {
  const section = document.querySelector('.items');
  const obj = {
  method: 'GET',
  headers: { Authorization: 'Bearer $ACCESS_TOKEN' },
  };

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', obj) 
    .then((r) => r.json())
    .then((data) => data.results.forEach(({ id: sku, title: name, thumbnail: image }) =>
     section.appendChild(createProductItemElement({ sku, name, image })))); 
};
window.onload = function onload() {
computers();
};
   
// 
// section.appendChild(createProductItemElement({ sku, name, image})

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
