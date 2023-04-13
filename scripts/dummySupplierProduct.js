// Deploy script

const { ethers } = require("hardhat");

async function deploy() {
  const SupplierProduct = await ethers.getContractFactory("supplierProduct");
  const supplierProduct = await SupplierProduct.deploy("user details");
  console.log("Contract address:", supplierProduct.address);
}

deploy();

// Interact script

const { ethers } = require("hardhat");

async function interact() {
  const encoder = new TextEncoder();

  const contractAddress = "CONTRACT_ADDRESS_HERE";
  const supplierProduct = await ethers.getContractAt(
    "supplierProduct",
    contractAddress
  );

  // Call addSupplierProduct function
  await supplierProduct.addSupplierProduct(
    "Product Name",
    "Product Description",
    10,
    100,
    1630742400, // Unix timestamp for 2021-09-04
    1662278400 // Unix timestamp for 2022-09-04
  );
  console.log("Supplier product added successfully");

  // Call getSupplierProductIds function
  const productIds = await supplierProduct.getSupplierProductIds();
  console.log("Product IDs:", productIds);

  // Call getSingleSupplierProduct function
  const singleProduct = await supplierProduct.getSingleSupplierProduct(
    productIds[0]
  );
  console.log("Single product:", singleProduct);

  // Call updateSupplierProductUints function
  await supplierProduct.updateSupplierProductUints(productIds[0], 2);
  console.log("Supplier product units updated successfully");

  // Call deleteSupplierProduct function
  await supplierProduct.deleteSupplierProduct(productIds[0]);
  console.log("Supplier product deleted successfully");
}

interact();
