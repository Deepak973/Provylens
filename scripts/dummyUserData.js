const { ethers } = require("hardhat");

async function deploy() {
  const UserDetails = await ethers.getContractFactory("userDetails");
  const userDetails = await UserDetails.deploy();
  console.log("User detailsContract address:", userDetails.address);
}

deploy();

async function interact() {
  const encoder = new TextEncoder();
  // Get the contract instance
  const contractAddress = "0x9F3b9F145D7E7a6487844A223ac348FA8EC152fF";
  const userDetailsContract = await ethers.getContractAt(
    "userDetails",
    contractAddress
  );

  // Add a user
  const name = "Jay Ambe floor factory";
  const physicalAddress = "810-bodakdev, ahmedabad, Gujarat, 398890";
  const image = "QmYV2kcbsbLrwjJ7ZZd5WzKvQ5a5Z5x1SajLb6NSvJFWVC";
  // await userDetailsContract.addUser(
  //   0,
  //   encoder.encode(name),
  //   encoder.encode(physicalAddress),
  //   encoder.encode(image)
  // );

  // Get all users
  const allUsers = await userDetailsContract.getAllUsers();
  console.log("All users:", allUsers);

  // Get all suppliers
  const [supplierAddresses, supplierDetails] =
    await userDetailsContract.getAllSuppliers();
  console.log("Supplier addresses:", supplierAddresses);
  console.log("Supplier details:", supplierDetails);
}

// interact();
