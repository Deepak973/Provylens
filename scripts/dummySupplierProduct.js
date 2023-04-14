// Deploy script

const { ethers } = require("hardhat");

async function deploy() {
  const SupplierProduct = await ethers.getContractFactory("supplierProduct");
  const supplierProduct = await SupplierProduct.deploy(
    "0x9F3b9F145D7E7a6487844A223ac348FA8EC152fF"
  );
  console.log("Contract address:", supplierProduct.address);
}

deploy();

// Interact script

async function interact() {
  const encoder = new TextEncoder();

  const contractAddress = "0x28a13393946449D53429fB3dbfb0Adec3F5cB3af";
  const supplierProduct = await ethers.getContractAt(
    "supplierProduct",
    contractAddress
  );

  // Call addSupplierProduct function
  // await supplierProduct.addSupplierProduct(
  //   encoder.encode("Wheat Floor"),
  //   encoder.encode(
  //     "powder made from the grinding of wheat used for human consumption"
  //   ),
  //   1000,
  //   100,
  //   1681396042, // Unix timestamp for 2023-13-04
  //   1713018396 // Unix timestamp for 2024-13-04
  // );
  // console.log("Supplier product added successfully");

  // // Call getSupplierProductIds function
  // const productIds = await supplierProduct.getSupplierProductIds();
  // console.log("Product IDs:", productIds);

  // // Call getSingleSupplierProduct function
  const singleProduct = await supplierProduct.getSingleSupplierProduct(2);
  console.log("Single product:", singleProduct);

  // const allProductsupplier = await supplierProduct.getAllProductsOfSupplier(
  //   "0xe57f4c84539a6414C4Cf48f135210e01c477EFE0"
  // );
  // console.log("Single product:", allProductsupplier);
  // Call updateSupplierProductUints function
  // await supplierProduct.updateSupplierProductUints(productIds[0], 2);
  // console.log("Supplier product units updated successfully");

  // Call deleteSupplierProduct function
  // await supplierProduct.deleteSupplierProduct(productIds[0]);
  // console.log("Supplier product deleted successfully");
}

// interact();
