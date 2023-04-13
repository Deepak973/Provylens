const hre = require("hardhat");

async function main() {
  const encoder = new TextEncoder();
  // Get the contract instance
  const Contract = await ethers.getContractFactory("userDetails");
  //   const contract = await Contract.deploy();
  //   await contract.deployed();
  const userDetailsContract = await Contract.attach(
    "0xCbe6A856ed9523A20B707AcD24794634d42eD7ca"
  );
  console.log(
    "Contract userDetailsContract deployed to:",
    userDetailsContract.address
  );

  // Add a user
  const name = "John Doe";
  const physicalAddress = "123 Main St.";
  const image = "QmYV2kcbsbLrwjJ7ZZd5WzKvQ5a5Z5x1SajLb6NSvJFWVC";
  //   await userDetailsContract.addUser(
  //     0,
  //     encoder.encode(name),
  //     encoder.encode(physicalAddress),
  //     encoder.encode(image)
  //   );

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
