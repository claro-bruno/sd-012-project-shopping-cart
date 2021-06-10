const END_POINT_ALL_COMPUTERS = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

const END_POINT_ID_COMPUTER = 'https://api.mercadolibre.com/items/$';

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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const idSelected = () => {

};

const appendComputers = (computers) => {
  const sectionItems = document.querySelector('.items');
  computers.forEach((computer) => {
    const { id, title, thumbnail } = computer;
    const newSection = createProductItemElement({ id, title, thumbnail });
    sectionItems.appendChild(newSection);
  });
};

const fetchAPI = async (endPoint) => {
  try {
    const response = await fetch(endPoint);
    const { results } = await response.json();
    if (endPoint === END_POINT_ALL_COMPUTERS) {
      appendComputers(results);
    } else {
      console.log('a')
    }
  } catch (error){
    console.log(error)
  }
};

window.onload = () =>{
  fetchAPI(END_POINT_ALL_COMPUTERS);
  fetchAPI(`${END_POINT_ID_COMPUTER}${idSelected()}`);
};
