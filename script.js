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
  
  function fetchApi() {
    const items = document.querySelector('.items');
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    
    fetch(url)
      .then((response) => checkResponse(response))
      .then((objSource) => {
        const arrayResults = objSource
          .results
          .map(({ id: sku, title: name, thumbnail: image }) => ({ sku, name, image }));
        arrayResults.forEach((objResult) => items.appendChild(createProductItemElement(objResult)));
      })
      .catch((err) => console.log(err));
  }

  window.onload = function onload() { 
    fetchApi();
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
