import userdetails from "../artifacts/contracts/userDetails.sol/userDetails.json";
import supplierdetails from "../artifacts/contracts/supplierProduct.sol/supplierProduct.json";
import manufacturerproduct from "../artifacts/contracts/manufacturerProduct.sol/manufacturerProduct.json";
import { USERDETAILS_CONTRACT_ADDRESS_BTTC } from "../config";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../config";
import { MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../config";
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

    const tx = await connectedContract.getAllSuppliers();

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const getAllSupplierProduct = async (add) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC,
      supplierdetails.abi,
      signer
    );

    const tx = await connectedContract.getAllProductsOfSupplier(add);

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
