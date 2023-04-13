const hre = require("hardhat");

async function deploy() {
  const UserDetails = await ethers.getContractFactory("userDetails");
  const userDetails = await UserDetails.deploy();
  console.log("User detailsContract address:", userDetails.address);
}

deploy();

async function main() {
  const encoder = new TextEncoder();
  // Get the contract instance
  const contractAddress = "CONTRACT_ADDRESS_HERE";
  const userDetailsContract = await ethers.getContractAt(
    "supplierProduct",
    contractAddress
  );

  // Add a user
  const name = "John Doe";
  const physicalAddress = "123 Main St.";
  const image = "QmYV2kcbsbLrwjJ7ZZd5WzKvQ5a5Z5x1SajLb6NSvJFWVC";
  await userDetailsContract.addUser(
    0,
    encoder.encode(name),
    encoder.encode(physicalAddress),
    encoder.encode(image)
  );

  // Get all users
  const allUsers = await userDetailsContract.getAllUsers();
  console.log("All users:", allUsers);

  // Get all suppliers
  const [supplierAddresses, supplierDetails] =
    await userDetailsContract.getAllSuppliers();
  console.log("Supplier addresses:", supplierAddresses);
  console.log("Supplier details:", supplierDetails);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
