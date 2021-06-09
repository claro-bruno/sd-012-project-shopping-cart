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

  function checkResponse(response) {
    if (response.ok) return response.json();
    throw new Error('Ocorreu um erro com a requisição');
  }
  
  function fetchApi(url) {
    return fetch(url)
      .then((response) => checkResponse(response))
      .catch((err) => console.log(err));
  }

   function cartItemClickListener(event) {
    console.log(event);
  }
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }

  function addItemInCart(event) {
    const cartItem = document.querySelector('.cart__items');
    const id = event.target.parentNode.firstChild.innerText;
    fetchApi(`https://api.mercadolibre.com/items/${id}`)
      .then(({ id: sku, title: name, price: salePrice }) => {
        cartItem.appendChild(createCartItemElement({ sku, name, salePrice }));
      })
      .catch((err) => console.log(err));
  }   

  function addBtnEvent() {
    const btnArray = document.querySelectorAll('.item__add');
    btnArray.forEach((btn) => {
      btn.addEventListener('click', (event) => addItemInCart(event));
    });
  }

  function addItems(results) {
    const items = document.querySelector('.items');
    const arrayResults = results
      .map(({ id: sku, title: name, thumbnail: image }) => ({ sku, name, image }));
    arrayResults.forEach((objResult) => items.appendChild(createProductItemElement(objResult)));
    addBtnEvent();
  }

    window.onload = function onload() { 
    fetchApi('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then(({ results }) => addItems(results))
      .catch((err) => console.log(err));
  };
  // function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

  // function cartItemClickListener(event) {
  //   // coloque seu código aqui
  // }

  // function createCartItemElement({ sku, name, salePrice }) {
  //   const li = document.createElement('li');
  //   li.className = 'cart__item';
  //   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  //   li.addEventListener('click', cartItemClickListener);
  //   return li;
  // };
