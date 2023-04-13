import userdetails from "../artifacts/contracts/userDetails.sol/userDetails.json";
import { USERDETAILS_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const checkRegistration = async (add) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const registerUser = new ethers.Contract(
      USERDETAILS_CONTRACT_ADDRESS_BTTC,
      userdetails.abi,
      signer
    );

    const tx = await registerUser.getSingleUser(add);

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

    const registerUser = new ethers.Contract(
      USERDETAILS_CONTRACT_ADDRESS_BTTC,
      userdetails.abi,
      signer
    );

    const tx = await registerUser.getAllManufacturers();

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
export const getAllSuppliers = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const registerUser = new ethers.Contract(
      USERDETAILS_CONTRACT_ADDRESS_BTTC,
      userdetails.abi,
      signer
    );

    const tx = await registerUser.getAllSuppliers();

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};