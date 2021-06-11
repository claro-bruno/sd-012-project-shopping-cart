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

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

  const removeItemLocalStorage = (aidi) => {
    const checkLocalStorage = localStorage.getItem('itensCartList');
    const arrayJson = JSON.parse(checkLocalStorage);
    const newArray = arrayJson.filter(({ id }) => id !== aidi);
    localStorage.setItem('itensCartList', JSON.stringify(newArray));
  };
  
  function cartItemClickListener(event) {
      // coloque seu código aqui
      const catchTotalPrice = document.querySelector('.total-price');
      const id = event.target.innerText.split('|')[0].replace(/SKU: /g, '').trim();
      const price = event.target.innerText.split('|')[2].replace(/PRICE:\s\$/g, '').trim();
      catchTotalPrice.innerText = (Number(catchTotalPrice.innerText) - Number(price)).toFixed(1);
      removeItemLocalStorage(id);
      event.target.remove();
  }
    
    function createCartItemElement({ id: sku, title: name, price: salePrice }) {
        const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
        li.addEventListener('click', cartItemClickListener);
        return li;
      }
      
      const fetchComputadores = async () => {
        const catchItemsList = document.querySelector('.items');
        const newP = document.createElement('p');
        newP.className = 'loading';
        newP.innerText = 'loading';
        catchItemsList.appendChild(newP);
        try {
          const respons = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
          const data = await respons.json();
          const dataResults = data.results;
          catchItemsList.innerHTML = '';
          dataResults.forEach(({ id, title, thumbnail }) => {
            const item = createProductItemElement({ id, title, thumbnail });
            catchItemsList.appendChild(item);
          });
        } catch (error) {
          return error;
        }
      };

      const saveLocalStorage = (object) => {
        let checkLocalStorage = localStorage.getItem('itensCartList');
        if (!checkLocalStorage) {
          checkLocalStorage = '[]';
        }
        const arrayJs = JSON.parse(checkLocalStorage);
        arrayJs.push(object);
        localStorage.setItem('itensCartList', JSON.stringify(arrayJs));
      };

      const sumPrices = (price) => {
        const catchTotalPrice = document.getElementsByClassName('total-price')[0];
        catchTotalPrice.innerText = Number(catchTotalPrice.innerText) + Number(price);
      };

      const fetchItem = (aidi) => {
        const catchCart = document.getElementsByClassName('cart__items')[0];
      fetch(`https://api.mercadolibre.com/items/${aidi}`)
        .then((response) => response.json())
        .then(({ id, title, price }) => {
          catchCart.appendChild(createCartItemElement({ id, title, price }));
          saveLocalStorage({ id, title, price });
          sumPrices(price);
        });
      };
      
      const addClickCatchId = () => {
        const catchButtons = document.querySelectorAll('.item');
        catchButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
              const itemId = event.target.parentNode.firstChild.innerText;
              fetchItem(itemId);
            });
        });
      };

      const clearCart = () => {
        const catchClearButton = document.querySelector('.empty-cart');
        console.log(catchClearButton);
        catchClearButton.addEventListener('click', () => {
          const catchCartList = document.querySelector('.cart__items');
          const catchTotalPrice = document.querySelector('.total-price');
          catchCartList.innerText = '';
          catchTotalPrice.innerText = 0;
          localStorage.setItem('itensCartList', '[]');
        });
      };

      window.onload = async function onload() {
        await fetchComputadores();
        addClickCatchId();
        const checkLocalStorage = localStorage.getItem('itensCartList');
        const catchCart = document.querySelector('.cart__items');
        if (checkLocalStorage) {
          const arrayJs = JSON.parse(checkLocalStorage);
          arrayJs.forEach((item) => {
            catchCart.appendChild(createCartItemElement(item));
            sumPrices(item.price);
          });
        }
        clearCart();
      };