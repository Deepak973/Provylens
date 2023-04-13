import userdetails from "../artifacts/contracts/userDetails.sol/userDetails.json";
import { USERDETAILS_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const checkRegistration = async (add) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      USERDETAILS_CONTRACT_ADDRESS_BTTC,
      userdetails.abi,
      signer
    );

    const tx = await connectedContract.getSingleUser(add);

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
export const getAllManufacturers = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      USERDETAILS_CONTRACT_ADDRESS_BTTC,
      userdetails.abi,
      signer
    );

    const tx = await connectedContract.getAllManufacturers();

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
export const getAllSupplierAddresses = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      USERDETAILS_CONTRACT_ADDRESS_BTTC,
      userdetails.abi,
      signer
    );

    const tx = await connectedContract.getAllSupplierAddresses();

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
