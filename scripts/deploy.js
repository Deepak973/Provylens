const hre = require("hardhat");

async function main() {
  // UserDetails Instance
  const UserDetails = await ethers.getContractFactory("userDetails");
  userDetailsInstance = await UserDetails.deploy();
  console.log(
    "userDetailsInstance deployed to address:",
    userDetailsInstance.address
  );
  await userDetailsInstance.deployed();

  // SupplierProduct Instance
  const SupplierProduct = await ethers.getContractFactory("supplierProduct");
  supplierProductInstance = await SupplierProduct.deploy(
    userDetailsInstance.address
  );
  console.log(
    "SupplierProduct deployed to address:",
    supplierProductInstance.address
  );

  await supplierProductInstance.deployed();

  // SupplierManufacturer Instance
  const supplierManufacturer = await ethers.getContractFactory(
    "supplierManufacturer"
  );
  supplierManufacturerInstance = await supplierManufacturer.deploy(
    userDetailsInstance.address,
    supplierProductInstance.address
  );
  console.log(
    "supplierManufacturerInstance deployed to address:",
    supplierManufacturerInstance.address
  );

  await supplierManufacturerInstance.deployed();

  // Manufacturer Product Instance
  const manufacturerProduct = await ethers.getContractFactory(
    "manufacturerProduct"
  );
  manufacturerProductInstance = await manufacturerProduct.deploy(
    userDetailsInstance.address,
    supplierManufacturerInstance.address
  );
  console.log(
    "manufacturerProductInstance deployed to address:",
    manufacturerProductInstance.address
  );

  await manufacturerProductInstance.deployed();

  // ManufacturerDistributor Instance
  const manufacturerDistributor = await ethers.getContractFactory(
    "manufacturerDistributor"
  );
  manufacturerDistributorInstance = await manufacturerDistributor.deploy(
    userDetailsInstance.address,
    manufacturerProductInstance.address
  );
  console.log(
    "manufacturerDistributorInstance deployed to address:",
    manufacturerDistributorInstance.address
  );

  await manufacturerDistributorInstance.deployed();
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
