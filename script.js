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
// 1)
function createProductItemElement({ sku, name, image }) {
    const section = document.createElement('section');
    section.className = 'item';
  
    section.appendChild(createCustomElement('span', 'item__sku', sku));
    section.appendChild(createCustomElement('span', 'item__title', name));
    section.appendChild(createProductImageElement(image));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
    return section;
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
  // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//  const li = document.createElement('li');
//  li.className = 'cart__item';
//  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//  li.addEventListener('click', cartItemClickListener);
//  return li;
// }

// const product = {
//  name: 'Smart TV Crystal UHD',
//  price: '1899.05',
//  seller: 'Casas de Minas',
// };

// let prod = {
//  id: undefined,
//  rg: undefined,
//  foto: undefined,
// };

function getandCreateItems() {
  const obj = {};
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((items) => items.results.forEach((item) => {
      const { id, title, thumbnail } = item;
      obj.sku = id;
      obj.name = title;
      obj.image = thumbnail;
      document.querySelector('.items').appendChild(createProductItemElement(obj));
    }));
    // .catch((error) => reject(console.log('error')))
}

window.onload = () => {  
    getandCreateItems();     
};
