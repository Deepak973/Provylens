// Deploy script

const { ethers } = require("hardhat");

async function deploy() {
  const ContractName = await ethers.getContractFactory("distributorProduct");
  const contract = await ContractName.deploy();
  console.log("Contract deployed to address:", contract.address);
}

deploy();

// Interact script

async function interact() {
  const contractAddress = "CONTRACT_ADDRESS_HERE";
  const contract = await ethers.getContractAt(
    "distributorProduct",
    contractAddress
  );

  // Call contract functions here
}

interact();
