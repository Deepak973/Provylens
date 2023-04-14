// Deploy script

const { ethers } = require("hardhat");

async function deploy() {
  const ManufacturerDistributor = await ethers.getContractFactory(
    "manufacturerDistributor"
  );
  const manufacturerDistributor = await ManufacturerDistributor.deploy(
    "0x30E198C8aa56985B534F01F935a938B646A7adf5",
    "0xaE471b0914c93a6A30665Cb5300F63874685112A"
  ); //user address & manufacture product
  console.log(
    "manufacturerDistributor deployed to address:",
    manufacturerDistributor.address
  );
}

deploy();

// Interact script

async function interact() {
  const encoder = new TextEncoder();
  const contractAddress = "0xCC3Fa1604728b54aa6e1B29B817bB674DBA137cB";
  const mdContract = await ethers.getContractAt(
    "manufacturerDistributor",
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

// interact();
