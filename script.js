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

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image
}) {
  const section = document.createElement('section');
  section.className = 'item';
  const product = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  product.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
}

function addItem() {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const id = event.target.parentElement.firstChild.innerHTML;
      const itemSelected = await fetchAddItem(id);
      const ol = document.querySelector('.cart__items')
      ol.appendChild(createCartItemElement(itemSelected))
    })
  })
}

function fetchAddItem(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((array) => resolve(array))
      .catch((error) => reject(error));
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice
}) {
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
    addItem()
  } catch (error) {
    console.log(error);
  }
};