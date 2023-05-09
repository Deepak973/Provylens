import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import "../../styles/addproduct.css";
import { useAccount, useSigner } from "wagmi";
import { MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../../config";
import addproduct from "../../artifacts/contracts/manufacturerProduct.sol/manufacturerProduct.json";
import { Theme, useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { getAllSupplierAddresses } from "../../helper/userDetailsHelper";
import { requestHistoryOfManufacturer } from "../../helper/supplierManufacturerHelper";
import hexToString from "../../helper/HexToStringConverter";
import { getAllSmIdForManufacturer } from "../../helper/supplierManufacturerHelper";

function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState([]);
  const { address, isConnected } = useAccount();
  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productUnit: "",
    expiryDate: null,
  });
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const getSupplierAddress = async () => {
    const reqHistory = await requestHistoryOfManufacturer(address);
    console.log(reqHistory);
    const filteredData = reqHistory.map((val, index) => {
      if (val[0]["status"] === 3) {
        return {
          reqId: parseInt(val[0]["smId"]),
          spId: parseInt(val[0]["spId"]),
          // name: hexToString(val["userName"]),
          status:
            val[0]["status"] === 1
              ? "Requested"
              : val[0]["status"] === 2
              ? "Approved"
              : val[0]["status"] === 3
              ? "Received"
              : null,
          quantity: val[0]["quantity"],
          productname: hexToString(val[1]["sp_name"]),
          p_description: hexToString(val[1]["sp_description"]),
          p_expiry_date: new Date(val[1]["sp_expiryDate"]).toDateString(),
          p_date_created: new Date(val[1]["sp_date"]).toDateString(),
          supplier_name: hexToString(val[2]["userName"]),
          supplier_address: val[0]["supplierAddress"],
        };
      }
    });
    setProduct(filteredData);
    console.log(filteredData);
  };

  useEffect(() => {
    getSupplierAddress();
  }, []);

  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
  const theme = useTheme();
  function getStyles(name, selectedProductId, theme) {
    return {
      fontWeight:
        selectedProductId.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  //for handling all data(form data)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductDetails((prevProductDetails) => ({
      ...prevProductDetails,
      [name]: value,
    }));
  };

  //for expiry date handle
  const handleEndDateChange = (event) => {
    setProductDetails((prevProductDetails) => ({
      ...prevProductDetails,
      expiryDate: event.target.value,
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
    console.log(selectedProductId);
    console.log(productDetails);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setLoading(true);
      const registerUser = new ethers.Contract(
        MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC,
        addproduct.abi,
        signer
      );
      const encoder = new TextEncoder();
      const tx = await registerUser.addManufacturerProduct(
        ["0x67F6F0F5dc21ed04ac83D6308e3d644ADbC3714D"],
        selectedProductId,
        encoder.encode(productDetails.productName),
        encoder.encode(productDetails.productDescription),
        productDetails.productUnit,
        productDetails.productPrice,
        Math.trunc(new Date().getTime() / 1000),
        Math.trunc(new Date(productDetails.expiryDate).getTime() / 1000)
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProductId(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div className="select-main" id="right-db-inside">
      <div className="product-details-main">
        <Box
          sx={{
            display: "flex",

            flexDirection: "column",
            alignItems: "center",
            "& > :not(style)": { m: 1 },
          }}
        >
          <FormControl
            sx={{ m: 1, width: "100%", paddingBottom: "10px", color: "white" }}
          >
            <InputLabel id="demo-multiple-name-label">Raw Products</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={selectedProductId}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
            >
              {product &&
                product.map((name) => (
                  <MenuItem
                    key={name}
                    value={name.spId}
                    style={getStyles(name, selectedProductId, theme)}
                  >
                    {name.productname.replace(/\0/g, "")}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            helperText=" "
            id="productName"
            name="productName"
            label="Product name"
            value={productDetails.productName}
            onChange={handleInputChange}
          />
          <TextField
            helperText=" "
            id="productDescription"
            name="productDescription"
            className="product-dec"
            label="Product description"
            value={productDetails.productDescription}
            onChange={handleInputChange}
          />
          <TextField
            helperText=" "
            id="productPrice"
            name="productPrice"
            label="Product price"
            value={productDetails.productPrice}
            onChange={handleInputChange}
          />
          <TextField
            helperText=" "
            id="productUnit"
            name="productUnit"
            label="Product unit"
            value={productDetails.productUnit}
            onChange={handleInputChange}
          />
          <TextField
            id="expiryDate"
            name="expiryDate"
            label="Expiry Date"
            type="date"
            value={productDetails.expiryDate}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
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
