import supplierManufacturer from "../artifacts/contracts/supplierManufacturer.sol/supplierManufacturer.json";
import { SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const getAllSmIdForManufacturer = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC,
      supplierManufacturer.abi,
      signer
    );

    const tx = await connectedContract.getAllSmIdForManufacturer();

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const requestProductfromManufacturer = async (
  spId,
  quantity,
  supplieraddress
) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC,
      supplierManufacturer.abi,
      signer
    );

    const tx = await connectedContract.requestProduct(
      spId,
      quantity,
      supplieraddress
    );

    await tx.wait();
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
      SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC,
      supplierManufacturer.abi,
      signer
    );

    const tx =
      await connectedContract.getAllSmIdForManufacturerWithproductDetails(add);

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const requestHistoryOfSupplier = async (add) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC,
      supplierManufacturer.abi,
      signer
    );

    const tx = await connectedContract.getAllSmIdForSupplierWithproductDetails(
      add
    );

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const transferProductToManufacturer = async (
  smId,
  manufacturerAddress,
  quantity,
  currentQuantity
) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC,
      supplierManufacturer.abi,
      signer
    );

    const tx = await connectedContract.transferProduct(
      smId,
      manufacturerAddress,
      quantity,
      currentQuantity
    );

    await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const receiveProduct = async (smId) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC,
      supplierManufacturer.abi,
      signer
    );

    const tx = await connectedContract.receiveProduct(smId);

    await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
