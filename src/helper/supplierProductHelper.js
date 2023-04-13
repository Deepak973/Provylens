import supplierProduct from "../artifacts/contracts/supplierProduct.sol/supplierProduct.json";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../config";
import { ethers } from "ethers";

export const getSingleSupplierProduct = async (spId) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const connectedContract = new ethers.Contract(
      SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC,
      supplierProduct.abi,
      signer
    );

    const tx = await connectedContract.getSingleSupplierProduct(spId);

    // await tx.wait();
    return tx;
  } catch (err) {
    console.log(err);
  }
};
