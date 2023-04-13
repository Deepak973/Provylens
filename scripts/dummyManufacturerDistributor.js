// Deploy script

const { ethers } = require("hardhat");

async function deploy() {
  const ManufacturerDistributor = await ethers.getContractFactory(
    "manufacturerDistributor"
  );
  const manufacturerDistributor = await ManufacturerDistributor.deploy(
    "userdetails address"
  );
  console.log(
    "manufacturerDistributor deployed to address:",
    manufacturerDistributor.address
  );
}

deploy();

// Interact script

const { ethers } = require("hardhat");

async function interact() {
  const encoder = new TextEncoder();
  const contractAddress = "CONTRACT_ADDRESS_HERE";
  const mdContract = await ethers.getContractAt(
    "ContractName",
    contractAddress
  );

  // Call contract functions here
  // Call the transferProduct function as the manufacturer
  const mpId = 1;
  const quantity = 10;
  const distributorAddress = distributor.address;
  const tx1 = await mdContract.transferProduct(
    mpId,
    distributorAddress,
    quantity,
    { from: manufacturer.address }
  );
  console.log("Transfer Product transaction:", tx1.hash);

  // Call the requestProduct function as the distributor
  const mpId2 = 2;
  const quantity2 = 5;
  const manufacturerAddress = manufacturer.address;
  const tx2 = await mdContract.requestProduct(
    mpId2,
    quantity2,
    manufacturerAddress,
    { from: distributor.address }
  );
  console.log("Request Product transaction:", tx2.hash);

  // Call the receiveProduct function as the distributor
  const mdId = 1;
  const mpId3 = 3;
  const tx3 = await mdContract.receiveProduct(mpId3, mdId, {
    from: distributor.address,
  });
  console.log("Receive Product transaction:", tx3.hash);

  // Call the getProduct function to get information about a transfer
  const mdId2 = 2;
  const mdInfo = await mdContract.getProduct(mdId2);
  console.log("Product transfer info:", mdInfo);

  // Call the getAllmdIdForDistributor function to get all transfers received by a distributor
  const distributorAddress2 = distributor.address;
  const mdList = await mdContract.getAllmdIdForDistributor(distributorAddress2);
  console.log("All product transfers for distributor:", mdList);
}

interact();
