import React, { useEffect, useRef, useState } from "react";
import "../../styles/deleteproduct.css";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import { getContract } from "@wagmi/core";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../../config";
import supplierProduct from "../../artifacts/contracts/supplierProduct.sol/supplierProduct.json";
import hexToString from "../../helper/HexToStringConverter";
import { getSpDetails } from "../../helper/GetSpDetails";

function DeleteProduct() {
  const { address, isConnected } = useAccount();
  const [productData, setProductData] = useState();
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(1);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const connectedContract = getContract({
    address: SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC,
    abi: supplierProduct.abi,
    signerOrProvider: signer,
  });

  const getData = async () => {
    const allProductsData = await getSpDetails(address);
    console.log(allProductsData);

    const filteredData = allProductsData[0]
      .map((product, index) => {
        if (product["sp_status"]) {
          return {
            spId: parseInt(allProductsData[1][index]["_hex"]),
          };
        } else {
          return null;
        }
      })
      .filter((product) => product !== null);
    console.log(filteredData);
    setProductData(filteredData);
  };

  const deleteProduct = async () => {
    try {
      setLoading(true);
      const deleteTx = await connectedContract.deleteSupplierProduct(
        selectedId
      );
      console.log(deleteTx);
      const receipt = await deleteTx.wait();
      if (receipt) {
        setLoading(false);
        setCounter((prev) => prev + 1);
        setProductData(null);
        getData();
      }
      toastInfo();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const toastInfo = () =>
    toast.success("Product Deleted", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  return (
    <>
      <div className="availabel-proposal-main-div">
        <div className="delete-product-main-div">
          <FormControl
            sx={{ m: 1, minWidth: 70 }}
            size="small"
            id="dropdown-formcontrol"
            className="select-parent"
          >
            <InputLabel id="select-label-status">Product Id</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              // value={selectedId}
              label="Product-Id"
              onChange={(e) => {
                setSelectedId(e.target.value);
              }}
              sx={{
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                ".MuiOutlinedInput-input": {
                  color: "white",
                  fontFamily: "HammersmithOne-Regular",
                },
                ".MuiSelect-icon": {
                  color: "rgba(255, 255, 255, 0.5)",
                },
                ".MuiOutlinedInput-notchedOutline.Mui-focused ": {
                  borderColor: "red",
                },
              }}
            >
              {productData &&
                counter &&
                productData.map((product) => (
                  <MenuItem value={product.spId}>
                    <div>{product.spId}</div>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Button
            onClick={() => deleteProduct()}
            variant="contained"
            size="large"
            className="delete-btn"
          >
            {loading ? (
              <>
                <div class="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </>
            ) : (
              <div>Delete</div>
            )}
          </Button>

          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </>
  );
}

export default DeleteProduct;
