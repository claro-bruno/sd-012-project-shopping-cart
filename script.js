function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
  
const saveCart = () => {
  localStorage.setItem('Cart', JSON.stringify(cartItems.innerHTML));
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
  const string = event.target.innerHTML;
  const value = Number(string.split('$')[1]);
  updateTotal(-value);
  event.target.remove();
  saveCart();
}

const loadCart = () => {
  const savedCart = localStorage.getItem('Cart');
  cartItems.innerHTML = JSON.parse(savedCart);
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => item.addEventListener('click', cartItemClickListener));
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
      pass(cartItems.appendChild(createCartItemElement(json)));
      saveCart();
    })
    .catch((error) => fail(error));
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
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
  const img = image.replace(/-I.jpg/g, '-O.jpg');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('span', 'item__price', `$ ${Number(price).toFixed(2)}`));
  section.appendChild(createCustomElement('span', 'item__title', name));
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
    const html = document.querySelector('html');
    html.appendChild(loadingScreen);
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
  cartItems.innerHTML = '';
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
  const itemCollection = document.querySelectorAll('.item');
  itemCollection.forEach((item) => {
    const currentItem = item;
    currentItem.addEventListener('mouseover', () => {
      currentItem.lastElementChild.style.backgroundColor = 'lightskyblue';
      currentItem.lastElementChild.style.color = 'black';
      currentItem.lastElementChild.style.transition = 'all 0.5s';
    });
  });
  itemCollection.forEach((item) => {
     const currentItem = item;
    currentItem.addEventListener('mouseout', () => {
      currentItem.lastElementChild.style.backgroundColor = 'blue';
      currentItem.lastElementChild.style.color = 'white';
      currentItem.lastElementChild.style.transition = 'all 0.5s';
    });
  });
};

const formBtn = document.querySelector('.search-btn');
const formInput = document.querySelector('.search-input');

const validation = () => {
  if (!formInput.value) formInput.style.boxShadow = '0 0 2px 1px red';
  else formInput.style.boxShadow = 'initial';
};

const preventDef = (e) => {
  e.preventDefault();
};

const itemsSection = document.querySelector('.items');

formBtn.addEventListener('click', preventDef);

formBtn.addEventListener('click', async () => {
  validation();
  if (!formInput.value) return;
  const productsList = await loadProducts(formInput.value);
  while (itemsSection.lastElementChild) {
    itemsSection.lastElementChild.remove();
  }
  productsList.forEach((product) => itemsSection.appendChild(createProductItemElement(product)));
  addsHoverToItems();
  formInput.value = '';
});

const cartContainer = document.querySelector('.cart');
const cartIcon = document.querySelector('.fa-shopping-cart');
let activeCart = false;

const boxshadow = '0 1px 2px 1px black';

cartIcon.addEventListener('click', () => {
  if (!activeCart) {
    cartContainer.classList.remove('hidden');
    cartIcon.style.backgroundColor = 'white';
    cartIcon.style.boxShadow = 'none';
    activeCart = true;
  } else {
    cartContainer.classList.add('hidden');
    cartIcon.style.backgroundColor = 'initial';
    cartIcon.style.boxShadow = boxshadow;
    activeCart = false;
  }
});

const closeCart = document.querySelector('.fa-times');
closeCart.addEventListener('click', () => {
  cartContainer.classList.add('hidden');
  cartIcon.style.backgroundColor = 'initial';
  cartIcon.style.boxShadow = boxshadow;
  activeCart = false;
});

const searchForm = document.querySelector('.search-form');
const searchIcon = document.querySelector('.fa-search-plus');
let activeSearch = false;

searchIcon.addEventListener('click', () => {
  if (!activeSearch) {
    searchForm.classList.remove('hidden');
    searchIcon.style.backgroundColor = 'white';
    searchIcon.style.boxShadow = 'none';
    activeSearch = true;
  } else {
    searchForm.classList.add('hidden');
    searchIcon.style.backgroundColor = 'initial';
    searchIcon.style.boxShadow = '0 1px 2px 1px black';
    activeSearch = false;
  }
});

window.addEventListener('load', async () => {
  loadCart();
  const productsList = await loadProducts('computador');
  productsList.forEach((product) => itemsSection.appendChild(createProductItemElement(product)));
  addsHoverToItems();
});