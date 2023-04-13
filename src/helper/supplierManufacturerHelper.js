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
