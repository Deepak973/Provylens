const encoder = new TextEncoder();

module.exports = {
  manufacturerRequest: {
    smId: 1,
    quantity: 30,
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
