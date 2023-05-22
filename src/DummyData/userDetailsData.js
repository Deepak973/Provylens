const encoder = new TextEncoder();

module.exports = {
  supplierData: {
    userType: 0,
    name: encoder.encode("XYZ Foods LLC"),
    physicalAddress: encoder.encode("789 Elm st, Anytown, USA"),
    image: encoder.encode(
      "https://ipfs.io/ipfs/QmeUsrweXxahUNNrYnwb2Qt62ziGdsYZ2Mf1cmUtpPqDQR?filename=logo-big.webp"
    ),
  },
  manufacturerData: {
    userType: 1,
    name: encoder.encode("Lay's Manufacturing Co"),
    physicalAddress: encoder.encode("123 Main st, Anytown, USA"),
    image: encoder.encode(
      "https://ipfs.io/ipfs/QmeUsrweXxahUNNrYnwb2Qt62ziGdsYZ2Mf1cmUtpPqDQR?filename=logo-big.webp"
    ),
  },
  distributorData: {
    userType: 2,
    name: encoder.encode("ABC Distributor INC"),
    physicalAddress: encoder.encode("456 Oak st, Anytown, USA"),
    image: encoder.encode(
      "https://ipfs.io/ipfs/QmSaBuNdQwyS4jYccfw25Zmj4b5PYzDVK7zdYxhp2axtSa/download.png"
    ),
  },
};
