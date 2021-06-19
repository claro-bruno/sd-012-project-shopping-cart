const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // desestruturação do objeto para acessar as 3 propriedades
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku)); //  tipo:span classe:item conteudo:sku
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const callApiItemsByID = (id) => { // Requisito 2
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => {
    const itemByID = createCartItemElement(data);
    cartItems.appendChild(itemByID);
  });
};

const AddItemOnCart = () => { // Requisito 2
  const getButtonOfItem = document.querySelectorAll('.item__add'); // retorna HTML Colection
  getButtonOfItem.forEach((element) => {
    element.addEventListener('click', (event) => {
      const getItemByID = event.target.parentElement.firstChild.innerText; // Para fazer essa linha, eu olhei o código do Henrique Alaracon.
      callApiItemsByID(getItemByID); // Pois eu não estava conseguindo acessar o ID do primeiro elemento chamado no click.
    });
  });
};

const renderProduct = () => { //  Requisito 1 - feito
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((element) => {
      items.appendChild(createProductItemElement(element));
    });
  })
  .then(() => AddItemOnCart());
};

window.onload = function onload() { renderProduct(); AddItemOnCart(); };