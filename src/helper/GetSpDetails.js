import supplierProduct from "../artifacts/contracts/supplierProduct.sol/supplierProduct.json";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const getSpDetails = async (address) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC,
      supplierProduct.abi,
      signer
    );

    const allProductsData = await connectedContract.getAllProductsOfSupplier(
      address
    );
    console.log(allProductsData);

    return allProductsData;
  } catch (err) {
    console.log(err);
  }
};
