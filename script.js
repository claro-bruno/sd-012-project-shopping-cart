function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

const saveCart = () => {
  // console.log(cart.innerHTML);
  localStorage.setItem('Cart', JSON.stringify(cart.innerHTML));
  localStorage.setItem('Total', JSON.stringify(totalPrice.innerHTML));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const updateTotal = (value) => {
  if (value === 0) totalPrice.innerHTML = 0;
  const currentPrice = Number(totalPrice.innerHTML);
  totalPrice.innerHTML = Math.round((value + currentPrice) * 100) / 100;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const string = event.target.innerHTML;
  const value = Number(string.split('$')[1]);
  updateTotal(-value);
  event.target.remove();
  saveCart();
}

const loadCart = () => {
  const savedCart = localStorage.getItem('Cart');
  cart.innerHTML = JSON.parse(savedCart);
  Object.values(cart.children).forEach((child) => {
    child.addEventListener('click', cartItemClickListener);
  });
  const loadedPrice = localStorage.getItem('Total');
  totalPrice.innerHTML = Number(JSON.parse(loadedPrice));
};

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = `cart__item ${salePrice}`;
  updateTotal(salePrice);
  console.log(salePrice);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (e) => {
  const addedId = getSkuFromProductItem(e.target.parentElement);
  
  return new Promise((pass, fail) => {
    fetch(`https://api.mercadolibre.com/items/${addedId}`)
    .then((result) => result.json())
    .then((json) => {
      pass(cart.appendChild(createCartItemElement(json)));
      saveCart();
    })
    .catch((error) => fail(error));
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  // if (element === 'button') {
  //   e.addEventListener('click', addToCart);
  // }
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
  price,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `$${price}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', addToCart);
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

const emptyCart = () => {
  cart.innerHTML = '';
  updateTotal(0);
  localStorage.clear();
};

const emptyCartBtn = document.querySelector('.empty-cart');

emptyCartBtn.addEventListener('click', emptyCart);

emptyCartBtn.addEventListener('mouseover', () => {
  const trashIcon = emptyCartBtn.firstElementChild;
  trashIcon.className = 'fas fa-trash-restore';
});

emptyCartBtn.addEventListener('mouseout', () => {
  const trashIcon = emptyCartBtn.firstElementChild;
  trashIcon.className = 'fas fa-trash';
});

const addsHoverToItems = () => {
  const itemCollection = document.getElementsByClassName('item');
  Object.keys(itemCollection).forEach((key) => itemCollection[key]
    .addEventListener('mouseover', () => {
      itemCollection[key].lastElementChild.style.backgroundColor = 'greenyellow';
      itemCollection[key].lastElementChild.style.color = 'black';
      itemCollection[key].lastElementChild.style.transition = 'all 0.5s';
    }));
  Object.keys(itemCollection).forEach((key) => itemCollection[key]
    .addEventListener('mouseout', () => {
      itemCollection[key].lastElementChild.style.backgroundColor = 'green';
      itemCollection[key].lastElementChild.style.color = 'white';
      itemCollection[key].lastElementChild.style.transition = 'all 0.5s';
    }));
};

window.addEventListener('load', async () => {
  loadCart();
  const productsList = await loadProducts('computador');
  const itemsSection = document.querySelector('.items');
  productsList.forEach((product) => itemsSection.appendChild(createProductItemElement(product)));
  addsHoverToItems();
});