// Deploy script

const { ethers } = require("hardhat");

async function deploy() {
  // Deploy the contract
  const ManufacturerProduct = await ethers.getContractFactory(
    "manufacturerProduct"
  );
  const manufacturerProduct = await ManufacturerProduct.deploy(
    "userDetails address"
  );
  await manufacturerProduct.deployed();

  // Print the contract address
  console.log("manufacturerProduct deployed to:", manufacturerProduct.address);
}
deploy();

// Interact script

const { ethers } = require("hardhat");

async function interact() {
  const contractAddress = "CONTRACT_ADDRESS_HERE";
  const manufacturerProductContract = await ethers.getContractAt(
    "ContractName",
    contractAddress
  );

  // Call contract functions here

  const supplierAddress = ["0x...", "0x...", "0x..."]; // Replace with supplier addresses
  const smId = [1, 2, 3]; // Replace with corresponding SM IDs
  const name = "Product1";
  const description = "Description1";
  const unit = 10;
  const price = 100;
  const date = Math.floor(Date.now() / 1000);
  const expiryDate = Math.floor(Date.now() / 1000) + 3600;
  await manufacturerProductContract.addManufacturerProduct(
    supplierAddress,
    smId,
    name,
    description,
    unit,
    price,
    date,
    expiryDate
  );

  // Call the updateManufacturerProductUints function
  const mpId = 1; // Replace with the ID of the manufacturer product to update
  const quantity = 5;
  await manufacturerProductContract.updateManufacturerProductUints(
    mpId,
    quantity
  );

  // Call the updateManufactureProductTransfer function
  const distributorAddress = "0x..."; // Replace with the distributor address
  await manufacturerProductContract.updateManufactureProductTransfer(
    mpId,
    distributorAddress
  );

  // Call the updateManufactureProductReceived function
  await manufacturerProductContract.updateManufactureProductReceived(mpId);

  // Call the getManufacturerProductIds function
  const myProductIds =
    await manufacturerProductContract.getManufacturerProductIds();
  console.log("My product IDs:", myProductIds);

  // Call the getSingleManufacturerProduct function
  const singleProduct =
    await manufacturerProductContract.getSingleManufacturerProduct(mpId);
  console.log("Single product:", singleProduct);

  // Call the getAllProductsOfManufacturer function
  const allProducts =
    await manufacturerProductContract.getAllProductsOfManufacturer("0x..."); // Replace with the manufacturer address
  console.log("All products:", allProducts);

  // Call the deleteManufacturerProduct function
  await manufacturerProductContract.deleteManufacturerProduct(mpId);
}

interact();
