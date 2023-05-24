const encoder = new TextEncoder();

module.exports = {
  supplierProduct: {
    name: encoder.encode("Potatoes"),
    desc: encoder.encode("famous potatoes from north Dakota"),
    unit: 100,
    price: 30,
    date: 1654363454,
    expiryDate: 1654592220,
  },
  manufacturerProduct: {
    userType: 1,
    name: encoder.encode("Basic Masala chips"),
    desc: encoder.encode(
      "Basic flovour, spicy, widely accepted by chips lovers"
    ),
    unit: 100,
    price: 30,
    date: 1654363454,
    expiryDate: 1654592220,
  },
};
