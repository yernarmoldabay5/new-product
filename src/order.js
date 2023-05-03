let basket = JSON.parse(localStorage.getItem("data")) || [];
let heatBill = document.getElementById("heatBill");

const itemsSum = () => {
  let cartCounter = document.querySelector(".cartCounter");
  let count = 0;

  basket.forEach(({ item }) => (count += item));
  cartCounter.innerHTML = count;
};

itemsSum();

const generateHeatBill = () => {
  // generate item rows
  let send_data = "";
  let items = basket
    .map((basketItem) => {
      let search = shopItems.find((item) => item.id === basketItem.id);
      let itemTotalPrice = basketItem.item * search.price;
      send_data = send_data + search.name + ":::" + basketItem.item + ":::" + itemTotalPrice.toFixed(2) + "\n";
      return `<tr><td>${search.name}</td><td>x${
        basketItem.item
      }</td><td>${itemTotalPrice.toFixed(2)}$</td></tr>`;
    })
    .join("");

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
  
  // get the current date
  let date = new Date().toISOString().slice(0, 10);
  let tg = window.Telegram.WebApp;
  tg.sendData(JSON.stringify(json));

  // create the complete UI of the bill
  heatBill.innerHTML = `
        <h1>Durger King LLC</h1>
        <p>213 SOUTH AWS STREET</br>
          INTERNET DYSTOPIA </br>
          Phone: 03213123123</p>
        
        <div class="date">Date: ${date}</div>
        <table>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
    
          ${items}
          
          <tr>
            <th>Total Price</th>
            <th></th>
            <th>${totalPrice}$</th>
          </tr>
        </table>
        <p class="heatBillFooter">Thank You!</p>
  `;
};

generateHeatBill();

const orderAgain = () => {
  localStorage.setItem("data", JSON.stringify([]));
  return window.location.replace("index.html");
};
