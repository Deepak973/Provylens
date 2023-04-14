import supplierProduct from "../artifacts/contracts/manufacturerProduct.sol/manufacturerProduct.json";
import { MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const getAllProductsOfManufacturer = async (spId) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC,
      supplierProduct.abi,
      signer
    );

    const tx = await connectedContract.getAllProductsOfManufacturer(spId);

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
