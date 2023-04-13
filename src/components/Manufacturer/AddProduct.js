import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import "../../styles/addproduct.css";
import { MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../../config";
import addproduct from "../../artifacts/contracts/manufacturerProduct.sol/manufacturerProduct.json";
import { Theme, useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { getAllSupplierAddresses } from "../../helper/userDetailsHelper";
import { getAllSmIdForManufacturer } from "../../helper/supplierManufacturerHelper";

function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [supplierAddresses, setSupplierAddresses] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [personName, setPersonName] = useState([]);
  const [productDetails, setProductDetails] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productUnit: "",
    startDate: null,
    endDate: null,
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

  const getData = async () => {
    const allSuppliersData = await getAllSupplierAddresses();
    console.log(allSuppliersData);
    setSupplierAddresses(allSuppliersData);

    const allSmIdForManufacturer = await getAllSmIdForManufacturer();
    console.log(allSmIdForManufacturer);
  };

  useEffect(() => {
    getData();
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
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
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
        MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC,
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
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
            <InputLabel id="demo-multiple-name-label">
              Supplier Addresses
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
            >
              {supplierAddresses &&
                supplierAddresses.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{ m: 1, width: "100%", paddingBottom: "10px", color: "white" }}
          >
            <InputLabel id="demo-multiple-name-label">SmId</InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
            >
              {supplierAddresses &&
                supplierAddresses.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
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
            id="endDate"
            name="endDate"
            label="Expiry Date"
            type="date"
            value={productDetails.endDate}
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
