const hre = require("hardhat");

async function main() {
  const encoder = new TextEncoder();

  const Contract = await ethers.getContractFactory("supplierProduct");
  // const contract = await Contract.deploy();
  // await contract.deployed();

  const supplierProductContract = await Contract.attach(
    "0x9036dE7d09BD7cb5326Eb58cafd7Df5d0aFE04a0"
  );

  // Use dummy data to test the addSupplierProduct function
  await supplierProduct.addSupplierProduct(
    encoder.encode("product name"),
    encoder.encode("product description"),
    100,
    10,
    1649865600,
    1749865600
  );

  console.log("Contract deployed to:", supplierProduct.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
