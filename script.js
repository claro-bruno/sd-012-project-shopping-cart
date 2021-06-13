window.onload = function onload() { };

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

function cartItemClickListener(event) { }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCartSetup({ sku }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((r) => r.json())
  .then((object) => {
    const buttons = document.querySelector('.cart__items');
    const callCart = createCartItemElement(
      { sku: object.id, name: object.title, salePrice: object.price },
    );
    buttons.appendChild(callCart);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addButton.addEventListener('click', () => {
    // eslint-disable-next-line no-use-before-define
    addToCartSetup({ sku });
  });
  section.appendChild(addButton);
  return section;
}

// eslint-disable-next-line no-unused-vars
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function saveCart() {
// const actualCart = document.getElementsByClassName('cart__items')[0];
// localStorage.setItem('actualCart', actualCart.innerHTML);
// }

// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((r) => r.json())
      .then((object) => object.results.forEach((result) => {
        // eslint-disable-next-line no-use-before-define
        const link = createProductItemElement(
          { sku: result.id, name: result.title, image: result.thumbnail },
);
        document.querySelector('.items').appendChild(link); 
}));

// function addToCartSetup() {
//   const buttons = document.querySelectorAll('.item__add');
//   buttons.forEach((btn) => {
//     btn.addEventListener('click', async (event) => {
//     const productId = event.target.parentElement.firstChild.innerText;
//     fetch(`https://api.mercadolibre.com/items/${productId}`)
//     .then ((r) => r.json())
//     console.log('teste')
//     .then ((object) => object.results.forEach((result) => {
//       const cartLink = createCartItemElement(
//         { sku: result.id, name: result.title, salePrice: result.price },
// );
//         document.querySelector('.cart__items').appendChild(cartLink);
// }));
//   });

//   })
