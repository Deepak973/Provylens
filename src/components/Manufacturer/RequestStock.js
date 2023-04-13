import React, { useState, useEffect, useRef } from "react";
import "../../styles/requeststock.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllSupplierAddresses } from "../../helper/userDetailsHelper";
import { getAllSupplierProduct } from "../../helper/userDetailsHelper";
import { requestProductfromManufacturer } from "../../helper/supplierManufacturerHelper";
import hexToString from "../../helper/HexToStringConverter";

import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { useAccount, useSigner } from "wagmi";

function RequestStock({ dashboardLinks }) {
  const { address, isConnected } = useAccount();
  const [supplierAddresses, setSupplierAddresses] = useState(false);
  const [selectedSupplierAddresses, setSelectedSupplierAddresses] = useState();
  const [productDetails, setProductDetails] = useState();
  const [selectedproductDetail, setSelectedProduct] = useState();

  const [quantity, setQuantity] = useState();
  const [personName, setPersonName] = useState([]);

  // const PK = process.env.PRIVATE_KEY; // channel private key
  // const Pkey = `0x${PK}`;
  // const _signer = new ethers.Wallet(Pkey);

  //push integration
  //send notification
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

  const getSupplierAddress = async () => {
    const allSuppliersData = await getAllSupplierAddresses();
    const filteredData = allSuppliersData[1].map((val, index) => {
      return {
        address: allSuppliersData[0][index],
        name: hexToString(val["userName"]),
      };
    });
    console.log(filteredData);
    console.log(allSuppliersData);
    setSupplierAddresses(filteredData);
  };

  const getSupplierProducts = async (add) => {
    setSelectedSupplierAddresses(add);
    const allSupplierProductsData = await getAllSupplierProduct(add);
    console.log(allSupplierProductsData);
    const filteredData = allSupplierProductsData[0].map((val, index) => {
      return {
        id: parseInt(allSupplierProductsData[1][index]),
        name: hexToString(val["sp_name"]),
      };
    });
    console.log(filteredData);
    setProductDetails(filteredData);
  };

  const requeststock = async () => {
    await requestProductfromManufacturer(
      selectedproductDetail,
      quantity,
      selectedSupplierAddresses
    );
    console.log(selectedproductDetail, quantity, selectedSupplierAddresses);
    toastInfo();
  };
  const toastInfo = () =>
    toast.success("Request Successfully", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  useEffect(() => {
    getSupplierAddress();
  }, []);

  return (
    <>
      <div className="datadao-details-main-div">
        <FormControl
          sx={{ m: 1, minWidth: 70 }}
          size="small"
          id="dropdown-formcontrol"
          className="select-parent"
        >
          <InputLabel id="select-label-status">Select Supplier</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            // value={age}
            label="Status"
            onChange={(e) => getSupplierProducts(e.target.value)}
          >
            {supplierAddresses &&
              supplierAddresses.map((item) => (
                <MenuItem key={item} value={item.address}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{ m: 1, minWidth: 70 }}
          size="small"
          id="dropdown-formcontrol"
          className="select-parent"
        >
          <InputLabel id="select-label-status">Select Product</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            // value={age}
            label="Status"
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {productDetails &&
              productDetails.map((item, i) => (
                <MenuItem key={i} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          helperText=" "
          id="demo-helper-text-aligned-no-helper"
          label="Quantity"
          onChange={(e) => {
            setQuantity(parseInt(e.target.value));
          }}
        />
        <Button
          onClick={() => {
            requeststock();
          }}
          variant="contained"
          size="large"
          className="request-btn"
        >
          Request
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
    </>
  );
}
export default RequestStock;
