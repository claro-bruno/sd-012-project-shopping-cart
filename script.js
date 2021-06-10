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

const getProductsAPI = async (url) => {
  const sectionItems = document.querySelector('.items');
  try {
    const resultsApi = await fetch(url);
    const objResults = await resultsApi.json();
    return objResults.results.forEach((item) => {
      const itemInfos = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      sectionItems.appendChild(createProductItemElement(itemInfos));
    });
  } catch (error) {
    console.log(error.message);
  }
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
  
// }

// function createCartItemElement({ id: sku, title: name, price: salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = function onload() {
  getProductsAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};