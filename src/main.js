let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];
let bill = document.getElementById("bill");
let checkButton = document.getElementById("bucketCheckBtnId");
let cartItems = document.getElementById("cartItems");
const checkBucket = () => {
    // localStorage.setItem("data", JSON.stringify([]));
    // return window.location.replace("cart.html");
    // shop.style.display = 'None';
    checkButton.style.display = 'None';
    generateCartItems();
};


let generateShopItems = () => {
    return (shop.innerHTML = shopItems
        .map((item) => {
            let search = basket.find((basketItem) => basketItem.id === item.id);
            let count = 0;
            if (search !== undefined) count = search.item;

            return `
      <div class="item shadow" id="${item.id}">
        <img src="${item.img}" alt="${item.name} image" />
        <div class="item__content">
          <h3>${item.name} <span>${item.price}$</span></h3>
          <div class="item__content--controls">
            <i onclick="decrement(${item.id})" class="fa-solid fa-minus"></i>
            <span class="quantity">${count}</span>
            <i onclick="increment(${item.id})" class="fa-solid fa-plus"></i>
          </div>
        </div>
      </div>
      `;
        })
        .join(""));
};

generateShopItems();


const decrement = (id) => {
    let search = basket.find((basketItem) => basketItem.id === id);
    if (search === undefined) return;
    if (search.item === 0) return;
    search.item--;

    update(id);

    basket = basket.filter((basketItem) => basketItem.item !== 0);
    localStorage.setItem("data", JSON.stringify(basket));
};

const increment = (id) => {
    let search = basket.find((basketItem) => basketItem.id === id);

    if (search === undefined) {
        basket.push({ id, item: 1 });
    } else {
        search.item++;
    }

    localStorage.setItem("data", JSON.stringify(basket));

    update(id);
};

const itemsSum = () => {
    let cartCounter = document.querySelector(".cartCounter");

    let count = 0;
    basket.forEach(({ item }) => (count += item));

    cartCounter.innerHTML = count;
};
itemsSum(); // Run this function at least once to update the cart counter on refresh.



const generateCartItems = () => {
    console.log("zawel")
    if (basket.length === 0) {
        console.log("zawel1")
        // Generate friendly message and go home button
        bill.innerHTML = `
      <h1>Your cart is empty!</h1>
      <a class="goHome" href="index.html">Check out our menu!</a>
    `;
        cartItems.innerHTML = ``;
    } else {
        console.log("zawel3")
        // Generate the cart
        shop.innerHTML = basket
            .map((basketItem) => {
                let search = shopItems.find(
                    (shopItem) => shopItem.id === basketItem.id
                ); // pull item from dummy data

                let total = (search.price * basketItem.item).toFixed(2); // calculate the total

                let cartItem = `
        <div id="${search.id}" class="cartItem green-shadow">
          <img src="${search.img}" alt="chicken-bucket" />
          <div class="cartItem__content">
          <h1>${search.name} ${search.price} $</h1>
          <div class="cartItem__content--total">Total: <span>${total} $</span></div>
          <div class="cartItem__content--controls">
            <i onclick="decrement(${search.id})" class="fa-solid fa-minus"></i>
            <span class="quantity">${basketItem.item}</span>
            <i onclick="increment(${search.id})" class="fa-solid fa-plus"></i>
            </div>
          </div>
          <button class="delete" onclick="deleteItem(${search.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        `;

                // return the populated HTML template
                return cartItem;
            })
            .join("");
    }
};

// generateCartItems();

const deleteItem = (id) => {
    // remove the item from the local storage
    basket = basket.filter((x) => x.id !== id);
    localStorage.setItem("data", JSON.stringify(basket));
    // remove the item from the UI
    let itemToDelete = document.getElementById(id);
    itemToDelete.remove();
    // update the cart counter
    itemsSum();
    totalPrice();
    // reload the page if there are no remaining items
    if (basket.length === 0) location.reload();
};


const update = (id) => {
    let search = basket.find((basketItem) => basketItem.id === id);

    document.getElementById(id).querySelector(".quantity").innerHTML =
        search.item;

    itemsSum();
    totalPrice();
};

const cancelOrder = () => {
    basket = [];
    localStorage.setItem("data", JSON.stringify(basket));
    itemsSum()
    totalPrice()
    location.reload();
    // window.location.replace("index.html");
    // generateShopItems()
    // checkButton.style.display = 'block';
    // bill.style.display = 'None'
};

const orderTg = () => {
    let basket_items = basket.map((basketItem) => {
        let search = shopItems.find((item) => item.id === basketItem.id);
        let itemTotalPrice = basketItem.item * search.price;
        return {
            "name": search.name,
            "quantity": basketItem.item,
            "total_price": itemTotalPrice.toFixed(2)
        };
    });

    // calculate teh total bill price
    let totalPrice = basket
        .map((basketItem) => {
            let search = shopItems.find((item) => item.id === basketItem.id);
            return search.price * basketItem.item;
        })
        .reduce((a, b) => a + b, 0)
        .toFixed(2);

    let json = {
        "basket_items": basket_items,
        "total_price": totalPrice
    };
    let tg = window.Telegram.WebApp;
    tg.sendData(json);
}

const totalPrice = () => {
    if (basket.length === 0) return;

    let totalPrice = basket.map((basketItem) => {
        let search = shopItems.find((shopItem) => shopItem.id === basketItem.id);
        return search.price * basketItem.item;
    });

    totalPrice = totalPrice.reduce((a, b) => a + b, 0).toFixed(2);

    bill.innerHTML = `
  <h1 id="totalPrice">Total Price: <span>${totalPrice} $</span></h1>
  <div>
    <a onclick="orderTg()" class="order">Order</a>
<!--    <a href="index.html" class="addMore">Add More Items</a>-->
    <button onclick="cancelOrder()" class="cancel">Cancel</button>
  </div>
`;
};

totalPrice();
