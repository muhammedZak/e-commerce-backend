function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

function calcPrices(orderItems) {
  // Calculate the items price
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Calculate the shipping price
  const shippingPrice = itemsPrice > 500 ? 0 : 10;

  // Calculate the tax price
  const taxPrice = 0.01 * itemsPrice;

  // Calculate the total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Return prices as strings fixed to 2 decimal places
  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(shippingPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice),
  };
}

module.exports = {
  calcPrices,
};
