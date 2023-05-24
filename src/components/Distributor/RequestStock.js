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
import { getAllManufacturers } from "../../helper/userDetailsHelper";
import { requestProductfromDistributor } from "../../helper/manufacturerDistributorHelper";
import { getAllProductsOfManufacturer } from "../../helper/GetMpDetails";

import hexToString from "../../helper/HexToStringConverter";

import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { useAccount, useSigner } from "wagmi";

function RequestStock({ dashboardLinks }) {
  const { address, isConnected } = useAccount();
  const [manufacturerAddresses, setManufacturerAddresses] = useState(false);
  const [selectedmanufacturerAddresses, setSelectedmanufacturerAddresses] =
    useState();
  const [productDetails, setProductDetails] = useState();
  const [selectedproductDetail, setSelectedProduct] = useState();

  const [quantity, setQuantity] = useState();
  const [personName, setPersonName] = useState([]);

  const theme = useTheme();
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const getManufacturerAddress = async () => {
    const allManufacturerData = await getAllManufacturers();
    console.log(allManufacturerData);
    // const filteredData = allManufacturerData.[1]map((val, index) => {
    const filteredData = allManufacturerData[1].map((val, index) => {
      return {
        address: allManufacturerData[0][index],
        // address: "0x9b4716573622751e7F6a56da251D054b6BBa4B00",
        name: hexToString(val["userName"]),
      };
    });
    console.log(filteredData);
    console.log(allManufacturerData);
    setManufacturerAddresses(filteredData);
  };

  const getManufacurerProducts = async (add) => {
    setSelectedmanufacturerAddresses(add);
    const allManufacturerProductData = await getAllProductsOfManufacturer(add);
    console.log(allManufacturerProductData);
    const filteredData = allManufacturerProductData[0].map((val, index) => {
      return {
        id: parseInt(allManufacturerProductData[1][index]),
        name: hexToString(val["mp_name"]),
      };
    });
    console.log(filteredData);
    setProductDetails(filteredData);
  };

  const requeststock = async () => {
    console.log(selectedproductDetail, quantity, selectedmanufacturerAddresses);
    await requestProductfromDistributor(
      selectedproductDetail,
      quantity,
      selectedmanufacturerAddresses
    );
    console.log(selectedproductDetail, quantity, selectedmanufacturerAddresses);
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
    getManufacturerAddress();
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
          <InputLabel id="select-label-status">Select Manufacturer</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            // value={age}
            label="Status"
            onChange={(e) => getManufacurerProducts(e.target.value)}
          >
            {manufacturerAddresses &&
              manufacturerAddresses.map((item) => (
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
