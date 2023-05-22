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
    name: encoder.encode("Lay's Manufacturing Co"),
    physicalAddress: encoder.encode("123 Main st, Anytown, USA"),
    image: encoder.encode(
      "https://ipfs.io/ipfs/QmeUsrweXxahUNNrYnwb2Qt62ziGdsYZ2Mf1cmUtpPqDQR?filename=logo-big.webp"
    ),
  },
  distributorProduct: {
    userType: 2,
    name: encoder.encode("ABC Distributor INC"),
    physicalAddress: encoder.encode("456 Oak st, Anytown, USA"),
    image: encoder.encode(
      "https://ipfs.io/ipfs/QmSaBuNdQwyS4jYccfw25Zmj4b5PYzDVK7zdYxhp2axtSa/download.png"
    ),
  },
};
