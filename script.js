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
const searchComputers = () => (new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((data) => resolve(data.results));
  })
);
const addComputers = (id) => (new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => resolve(data));
  })
);
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const itemsCart = document.getElementsByClassName('cart__items');
  itemsCart[0].removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addComputerCartClick = (event) => {
  const computerSelected = event.target.parentNode;
  const itemsCart = document.getElementsByClassName('cart__items');
  addComputers(computerSelected.childNodes[0].innerText)
    .then((computers) => {
        const item = createCartItemElement({
          sku: computers.id, 
          name: computers.title, 
          salePrice: computers.price,
        });
        itemsCart[0].appendChild(item);
      });
};
window.onload = function onload() { 
  const sectionItems = document.getElementsByClassName('items');
    (searchComputers()
      .then((computers) => {
        computers.forEach((computer) => {
          const item = createProductItemElement({
            sku: computer.id, 
            name: computer.title, 
            image: computer.thumbnail,
          });
          sectionItems[0].appendChild(item);
        });
        const buttons = document.getElementsByClassName('item__add');
        for (let index = 0; index < buttons.length; index += 1) {
          const button = buttons[index];
          button.addEventListener('click', addComputerCartClick);
        }
      })
    );
};