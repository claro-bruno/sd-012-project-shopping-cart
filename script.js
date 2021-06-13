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

// eslint-disable-next-line no-unused-vars
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// eslint-disable-next-line no-unused-vars
function cartItemClickListener(event) {
  // coloque seu código aqui
  const click = event.target;
  if (click.classList.contains('cart__item')) {
    click.remove();
    // else função de salvar
  }
}

// eslint-disable-next-line no-unused-vars
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function addToCartSetup() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (event) => {
    const productId = event.target.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((r) => r.json())
    .then((object) => {
      const cartLink = createCartItemElement(
        { sku: object.id, name: object.title, salePrice: object.price },
);
        document.querySelector('.cart__items').appendChild(cartLink);
});
  });
  });
}
function callWindowOnLoad() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((r) => r.json())
      .then((object) => object.results.forEach((result) => {
        // eslint-disable-next-line no-use-before-define
        const link = createProductItemElement(
          { sku: result.id, name: result.title, image: result.thumbnail },
);
        document.querySelector('.items').appendChild(link); 
}))

.then(() => addToCartSetup());
}

window.onload = function onload() {
callWindowOnLoad();
// addToCartSetup();
};
