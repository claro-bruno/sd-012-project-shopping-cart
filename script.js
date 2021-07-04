// Requisito 5
function totalPrice() {
  const totalItems = document.querySelectorAll('.cart__item');
  let total = 0;
  totalItems.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = Math.round(total * 100) / 100;
}

function teste() {
  const vamos = document.querySelector('.cart__items');
  return vamos;
}
// Requisito 4 - Referência: https://github.com/tryber/sd-012-project-shopping-cart/blob/Laura-Ramos-Shopping-Cart-Project/script.js
function updateStorage() {
  localStorage.setItem('cart', teste().innerHTML);
  totalPrice();
}
// Requisito 4
function loadStorage() {
  teste().innerHTML = localStorage.getItem('cart');
  totalPrice();
}

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
  const { target } = event;// lint pede que seja destructuring
  target.remove();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function generateItemsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('.loading').remove();   
    data.results.forEach((item) => {
      const objeto = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      // console.log(objeto);
      // // o objeto está buscando os dados da api: a ID ( sku), o title e o thumbnail. Esta explicação está no plantão da T08 pelo slack.
       document.querySelector('.items').appendChild(createProductItemElement(objeto));
       totalPrice();
    });
  });
}

// function addItemToCart() {
//   document.querySelector('.items').addEventListener('click', (event) => {
//     if (event.target.classList.contains('item__add')) {
//       const parentElement = event.target.parentElement;
//       const sku = getSkuFromProductItem(parentElement);
//       fetch(`https://api.mercadolibre.com/items/${sku}`)
//       .then((response) => response.json())
//       .then((data) => {
//         const objeto = {
//           sku,
//           name: data.title,
//           salePrice: data.price,
//         };
//         document.querySelector('.cart__items').appendChild(createCartItemElement(objeto));
//       });
//     }
//   });
// }

// REQ 2 visto no repositório de Laura Ramos https://github.com/tryber/sd-012-project-shopping-cart/tree/Laura-Ramos-Shopping-Cart-Project
function addItemToCart(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then((response) => {
      response.json().then((itemList) => {
        const section = document.getElementsByClassName('cart__items')[0];
        section.appendChild(createCartItemElement(itemList));
        updateStorage();
    }); 
  });
}

document.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    addItemToCart(getSkuFromProductItem(event.target.parentElement));
    updateStorage();
  }
});

function clearShop() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice();
    updateStorage();
  });
}

window.onload = function onload() {
  generateItemsList();
  loadStorage();
  totalPrice();
  clearShop();
};