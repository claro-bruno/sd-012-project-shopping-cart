function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

const addButton = (e) => {
  const addedId = getSkuFromProductItem(e.target.parentElement);
  const cart = document.querySelector('.cart__items');
  return new Promise((pass, fail) => {
    fetch(`https://api.mercadolibre.com/items/${addedId}`)
      .then((result) => result.json())
      .then((json) => pass(cart.appendChild(createCartItemElement(json))))
      .catch((error) => fail(error));
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.addEventListener('click', addButton);
  }
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

// ajuda de matheus set, da turma 11
let loadingElement = null;

function toggleLoadingText(visible) {
  if (visible) {
    const loadingScreen = document.createElement('section');
    loadingScreen.className = 'loading';
    const loadingBox = document.createElement('span');
    loadingBox.innerText = 'Loading...';
    loadingScreen.appendChild(loadingBox);
    const body = document.querySelector('body');
    body.appendChild(loadingScreen);
    loadingElement = loadingScreen;
  } else {
    loadingElement.remove();
  }
}

const loadProducts = (query) => {
  toggleLoadingText(true);
  return new Promise((pass, fail) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
      .then((result) => result.json())
      .then((json) => {
        toggleLoadingText(false);
        pass(json.results);
      })
    .catch((error) => fail(error));
  });
};

window.addEventListener('load', async () => {
  const itemsSection = document.querySelector('.items');
  const productsList = await loadProducts('computador');
  productsList.forEach((product) => itemsSection.appendChild(createProductItemElement(product))); 
});