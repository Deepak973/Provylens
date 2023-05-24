import manufacturerdistributor from "../artifacts/contracts/manufacturerDistributor.sol/manufacturerDistributor.json";
import { MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const requestProductfromDistributor = async (
  mpId,
  quantity,
  manufactureraddress
) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(await signer.getAddress());

    const connectedContract = new ethers.Contract(
      MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_BTTC,
      manufacturerdistributor.abi,
      signer
    );

    const tx = await connectedContract.requestProduct(
      mpId,
      quantity,
      manufactureraddress
    );

    await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const requestHistoryOfDistributor = async (add) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_BTTC,
      manufacturerdistributor.abi,
      signer
    );

    const tx = await connectedContract.getAllmdIdForDistributor(add);

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const requestHistoryOfManufacturer = async (add) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_BTTC,
      manufacturerdistributor.abi,
      signer
    );

    const tx = await connectedContract.getAllmdIdForManufacturer(add);

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const transferProductToDistributor = async (
  mpId,
  distributorAddress,
  quantity,
  currentQuantity
) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_BTTC,
      manufacturerdistributor.abi,
      signer
    );

    const tx = await connectedContract.transferProduct(
      mpId,
      distributorAddress,
      quantity
    );

    await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const receiveProduct = async (mpId, mdId) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_BTTC,
      manufacturerdistributor.abi,
      signer
    );

    const tx = await connectedContract.receiveProduct(mpId, mdId);

    await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
