function pegarItem() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((array) => resolve(array))
    .catch((error) => reject(error));
  });
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const product = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  product.appendChild(section);
  // return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((btn) => {
  btn.addEventListener('click', async (event) => {
    const xablau = event.target.className.querySelector('cart__item')
    const itemSelected = await addItem(xablau);
    createCartItemElement(itemSelected)
    console.log('oiii')
    // const cartItem = document.querySelector('cart__items')
  })
})
}

function addItem() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=id')
    .then((response) => response.json())
    .then((array) => resolve(array))
    .catch((error) => reject(error));
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = async () => {
  try {
  const item = await pegarItem();
  item.results.forEach((itemML) => createProductItemElement(itemML));
  } catch (error) {
    console.log(error);
  }
};