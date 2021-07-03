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
  // coloque seu código aqui
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
  .then((data) =>
    data.results.forEach((item) => {
      const objeto = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      // console.log(objeto);
      // // o objeto está buscando os dados da api: a ID ( sku), o title e o thumbnail. Esta explicação está no plantão da T08 pelo slack.
       document.querySelector('.items').appendChild(createProductItemElement(objeto));
    }));
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

function addItemToCart(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then((response) => {
      response.json().then((itemList) => {
        const section = document.getElementsByClassName('cart__items')[0];
        section.appendChild(createCartItemElement(itemList));
    }); 
  });
}

document.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    addItemToCart(getSkuFromProductItem(event.target.parentElement));
  }
});

window.onload = function onload() {
  generateItemsList();
};