import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import "../../styles/addproduct.css";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../../config";
import addproduct from "../../artifacts/contracts/supplierProduct.sol/supplierProduct.json";

function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productUnit: "",
    startDate: null,
    endDate: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductDetails((prevProductDetails) => ({
      ...prevProductDetails,
      [name]: value,
    }));
  };

  const handleStartDateChange = (event) => {
    setProductDetails((prevProductDetails) => ({
      ...prevProductDetails,
      startDate: event.target.value,
    }));
  };

  const handleEndDateChange = (event) => {
    setProductDetails((prevProductDetails) => ({
      ...prevProductDetails,
      endDate: event.target.value,
    }));
  };
  const toastInfo = () =>
    toast.success("Product Added", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const handleSubmit = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setLoading(true);
      const registerUser = new ethers.Contract(
        SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC,
        addproduct.abi,
        signer
      );

      const encoder = new TextEncoder();
      const tx = await registerUser.addSupplierProduct(
        encoder.encode(productDetails.productName),
        encoder.encode(productDetails.productDescription),
        productDetails.productUnit,
        productDetails.productPrice,
        Math.trunc(new Date().getTime() / 1000),
        Math.trunc(new Date(productDetails.endDate).getTime() / 1000)
      );
      const receipt = await tx.wait();
      if (receipt) {
        setLoading(false);
      }
      toastInfo();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
    // TODO: Handle form submission
  };

  return (
    <div className="select-main" id="right-db-inside">
      <div className="product-details-main">
        <Box
          sx={{
            display: "flex",

            flexDirection: "column",
            alignItems: "center",
            "& > :not(style)": { m: 1, width: "70%" },
          }}
        >
          <TextField
            helperText=" "
            id="productName"
            name="productName"
            label="Product name"
            value={productDetails.productName}
            onChange={handleInputChange}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              ".MuiInputLabel-root ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiInputLabel-root.Mui-focused ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiOutlinedInput-input": {
                color: "white",
                fontFamily: "HammersmithOne-Regular",
              },
            }}
          />
          <TextField
            helperText=" "
            id="productDescription"
            name="productDescription"
            className="product-dec"
            label="Product description"
            value={productDetails.productDescription}
            onChange={handleInputChange}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              ".MuiInputLabel-root ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiInputLabel-root.Mui-focused ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiOutlinedInput-input": {
                color: "white",
                fontFamily: "HammersmithOne-Regular",
              },
            }}
          />
          <TextField
            helperText=" "
            id="productPrice"
            name="productPrice"
            label="Product price"
            value={productDetails.productPrice}
            onChange={handleInputChange}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              ".MuiInputLabel-root ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiInputLabel-root.Mui-focused ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiOutlinedInput-input": {
                color: "white",
                fontFamily: "HammersmithOne-Regular",
              },
            }}
          />
          <TextField
            helperText=" "
            id="productUnit"
            name="productUnit"
            label="Product unit"
            value={productDetails.productUnit}
            onChange={handleInputChange}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              ".MuiInputLabel-root ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiInputLabel-root.Mui-focused ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiOutlinedInput-input": {
                color: "white",
                fontFamily: "HammersmithOne-Regular",
              },
            }}
          />
          <TextField
            id="endDate"
            name="endDate"
            label="Expiry Date"
            type="date"
            value={productDetails.endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              ".MuiInputLabel-root ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
                textTransform: "capitalize",
              },
              ".MuiInputLabel-root.Mui-focused ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiOutlinedInput-input": {
                color: "white",
                fontFamily: "HammersmithOne-Regular",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",

            flexDirection: "column",
            alignItems: "center",
            "& > :not(style)": { m: 1 },
          }}
        >
          <Button
            variant="contained"
            size="large"
            className="product-btn"
            onClick={handleSubmit}
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
              <div>Add</div>
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
        </Box>
      </div>
    </div>
  );
}

export default AddProduct;
