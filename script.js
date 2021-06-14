const fetchAPI = () => {
   return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
   .then((response) => response.json())
   .then((data) => {
     data.results.forEach((product) => {
     const itemSpace = document.querySelector('.items');
     const item = createProductItemElement(product);
     itemSpace.appendChild(item);
     });
   })
   .catch((error) => console.error());
};

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
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const buttonEvents = () => {
  const products = document.querySelectorAll('.item');
  products.forEach((product) => {
    const button = product.querySelector('button');
    button.addEventListener('click', () => {
       const itemID = getSkuFromProductItem(product);
       fetch(`https://api.mercadolibre.com/items/${itemID}`)
       .then((response) => response.json())
       .then((item) => {
        const father = document.querySelector('.cart__items');
        father.appendChild(createCartItemElement(item));
        somaCarrinho(item.price);
       });
    });
  });
}
const cartSection = document.querySelector('.cart');
const soma = document.createElement('span');
  soma.className = 'total-price';
  soma.innerHTML = 0;
  cartSection.appendChild(soma);

const somaCarrinho = (price) => {
  const capturaSoma = document.querySelector('.total-price');

  capturaSoma.innerHTML = parseFloat(capturaSoma.innerHTML) + parseFloat(price);
}

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach((item) => item.remove());
  })
}

window.onload = function onload() {
  fetchAPI()
  .then(() => buttonEvents());
  emptyCart();
};