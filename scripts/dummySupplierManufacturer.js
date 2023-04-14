// Deploy script

const { ethers } = require("hardhat");

async function deploy() {
  // Deploy the contract
  const SupplierManufacturer = await ethers.getContractFactory(
    "supplierManufacturer"
  );
  const supplierManufacturer = await SupplierManufacturer.deploy(
    "0x30E198C8aa56985B534F01F935a938B646A7adf5",
    "0xA9a824ACca86766821Ea125C180b22CA4E670f60"
  );
  await supplierManufacturer.deployed();

  // Print the contract address
  console.log(
    "supplierManufacturer deployed to:",
    supplierManufacturer.address
  );
}

deploy();

// Interact script

async function interact() {
  const encoder = new TextEncoder();

  const contractAddress = "0x6cE2eAC2cE25BDd1f323C53d026c83363767C548";
  const supplierManufacturer = await ethers.getContractAt(
    "supplierManufacturer",
    contractAddress
  );

  // Call contract functions here

  // Call the functions in the contract
  // const allSupplierAddresses =
  //   await supplierManufacturer.getAllSupplierAddresses();
  // console.log("All supplier addresses:", allSupplierAddresses);

  // const changeOwnerTx = await supplierManufacturer.changeOwner(user1.address);
  // await changeOwnerTx.wait();
  // console.log("Owner changed");

  // const changeUdAddressTx = await supplierManufacturer.changeUdAddress(
  //   userDetailsAddress
  // );
  // await changeUdAddressTx.wait();
  // console.log("User details address changed");

  // const changeSpAddressTx = await supplierManufacturer.changeSpAddress(
  //   supplierProductAddress
  // );
  // await changeSpAddressTx.wait();
  // console.log("Supplier product address changed");

  // const transferProductTx = await supplierManufacturer.transferProduct(
  //   1, // replace with the correct smId
  //   user2.address,
  //   10, // replace with the correct quantity
  //   10 // replace with the correct currentQuantity
  // );
  // await transferProductTx.wait();
  // console.log("Product transferred");

  const requestProductTx = await supplierManufacturer.requestProduct(
    1, // replace with the correct spId
    10, // replace with the correct quantity
    user1.address
  );
  await requestProductTx.wait();
  console.log("Product requested");

  // const receiveProductTx = await supplierManufacturer.receiveProduct(1); // replace with the correct smId
  // await receiveProductTx.wait();
  // console.log("Product received");
}

// interact();
