import manufacturerProduct from "../artifacts/contracts/manufacturerProduct.sol/manufacturerProduct.json";
import { MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const getAllProductsOfManufacturer = async (address) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC,
      manufacturerProduct.abi,
      signer
    );

    const allProductsData =
      await connectedContract.getAllProductsOfManufacturer(address);
    console.log(allProductsData);

    return allProductsData;
  } catch (err) {
    console.log(err);
  }
};
