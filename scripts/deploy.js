const hre = require("hardhat");

async function main() {
  // const userDetailsFactory = await hre.ethers.getContractFactory("userDetails");
  // const userDetails = await userDetailsFactory.deploy();

  // const supplierProductFactory = await hre.ethers.getContractFactory(
  //   "supplierProduct"
  // );
  // const supplierProduct = await supplierProductFactory.deploy();

  // const manufacturerProductFactory = await hre.ethers.getContractFactory(
  //   "manufacturerProduct"
  // );
  // const manufacturerProduct = await manufacturerProductFactory.deploy();

  // const distributorProductFactory = await hre.ethers.getContractFactory(
  //   "distributorProduct"
  // );
  // const distributorProduct = await distributorProductFactory.deploy();

  const supplierManufacturerFactory = await hre.ethers.getContractFactory(
    "supplierManufacturer"
  );
  const supplierManufacturer = await supplierManufacturerFactory.deploy();

  // const manufacturerDistributorFactory = await hre.ethers.getContractFactory(
  //   "manufacturerDistributor"
  // );
  // const manufacturerDistributor = await manufacturerDistributorFactory.deploy();

  // await userDetails.deployed();
  // await supplierProduct.deployed();
  // await manufacturerProduct.deployed();
  // await distributorProduct.deployed();
  await supplierManufacturer.deployed();
  // await manufacturerDistributor.deployed();

  // console.log("Contract userDetails deployed to:", userDetails.address);
  // console.log("Contract supplierProduct deployed to:", supplierProduct.address);
  // console.log(
  //   "Contract manufacturerProduct deployed to:",
  //   manufacturerProduct.address
  // );
  // console.log(
  //   "Contract distributorProduct deployed to:",
  //   distributorProduct.address
  // );
  console.log(
    "Contract supplierManufacturer deployed to:",
    supplierManufacturer.address
  );
  // console.log(
  //   "Contract manufacturerDistributor deployed to:",
  //   manufacturerDistributor.address
  // );
}

// Contract userDetails deployed to: 0xc74799946f5aedFd6A0DaFb1B475606542A5A497  //verified
// Contract supplierProduct deployed to: 0xca31f2E4A6595586A617Ae6bf194EfcB243C187e   //verified
// Contract manufacturerProduct deployed to: 0xd53aBA0deA01B924B38808C9e6eACF14C3FD8F86   //verified
// Contract distributorProduct deployed to: 0xcFbF41Eab7401D3475825e6D3BEe4887b26b8Bbe    //verified
// Contract supplierManufacturer deployed to: 0xfeca6Ad64E59105Ce2eF35F154442B7b6D7D8Cf7    //verified
// Contract manufacturerDistributor deployed to: 0x6f591524288Efda19d80FE1Af2ec3FE13DA69Aa7   //verified

// graph add 0x829D5780E6a31f2B7A9a7B44Cc45bd980baDB081 --contract-name manufacturerDistributor

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
