import React, { useEffect, useRef, useState } from "react";
import "../styles/deleteproduct.css";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import feature1 from "../assets/feature-1.png";
import bubble4 from "../assets/fixed4.png";
import "../styles/viewproduct.css";
import { createClient } from "urql";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hexToString from "./HexToStringConverter";

function VerifyProduct() {
  const [age, setAge] = useState("");
  const [smId, setSmId] = useState();
  const [supplierDetails, setSupplierDetails] = useState();
  const [manufacturerDetails, setManufacturerDetails] = useState();
  const [supplierProduct, setSupplierProduct] = useState();

  const getSmId = async (smId) => {
    const data_ = `query MyQuery {
      eventSupplierManufacturerTransfers(where: {_smId: "${smId}"}) {
        _dispatchTime
        _manufacturerAddress
        _smId
        _spId
        _supplierAddress
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();

    setSmId({
      dispatchTime: new Date(
        result1.data.eventSupplierManufacturerTransfers[0]["_name"] * 1000
      ).toDateString(),
      manufacturerAddress:
        result1.data.eventSupplierManufacturerTransfers[0][
          "_manufacturerAddress"
        ],
      smId: result1.data.eventSupplierManufacturerTransfers[0]["_smId"],
      spId: result1.data.eventSupplierManufacturerTransfers[0]["_spId"],
      supplierAddress:
        result1.data.eventSupplierManufacturerTransfers[0]["_supplierAddress"],
    });
    console.log(result1.data.eventSupplierManufacturerTransfers[0]);

    await getSupplier(
      result1.data.eventSupplierManufacturerTransfers[0]["_supplierAddress"]
    );

    await getManufacturer(
      result1.data.eventSupplierManufacturerTransfers[0]["_manufacturerAddress"]
    );

    await getProductDetails(
      result1.data.eventSupplierManufacturerTransfers[0]["_spId"]
    );
  };

  const getSupplier = async (supplierAddress) => {
    const data_ = `query MyQuery {
      eventUserDatas(where: {_address: "${supplierAddress.toLowerCase()}"}) {
        _image
        _name
        _physicalAddress
        _timeUpdated
        _type
        blockNumber
        blockTimestamp
        id
        transactionHash
        _address
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();
    // console.log(hexToString(result1.data.eventUserDatas[0]["_name"]));
    var role = "";
    if (result1.data.eventUserDatas[0]["_type"] === 0) role = "Supplier";
    if (result1.data.eventUserDatas[0]["_type"] === 1) role = "Manufacturer";
    if (result1.data.eventUserDatas[0]["_type"] === 2) role = "Distributor";

    setSupplierDetails({
      name: hexToString(result1.data.eventUserDatas[0]["_name"]).slice(1),
      type: role,
      phy_add: hexToString(
        result1.data.eventUserDatas[0]["_physicalAddress"]
      ).slice(1),
      image: hexToString(result1.data.eventUserDatas[0]["_image"]),
      id: hexToString(result1.data.eventUserDatas[0]["id"]),
    });

    console.log(result1.data.eventUserDatas[0]);
  };

  const getManufacturer = async (manufacturerAddress) => {
    const data_ = `query MyQuery {
      eventUserDatas(where: {_address: "${manufacturerAddress.toLowerCase()}"}) {
        _image
        _name
        _physicalAddress
        _timeUpdated
        _type
        blockNumber
        blockTimestamp
        id
        transactionHash
        _address
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();
    // console.log(hexToString(result1.data.eventUserDatas[0]["_name"]));
    var role = "";
    if (result1.data.eventUserDatas[0]["_type"] === 0) role = "Supplier";
    if (result1.data.eventUserDatas[0]["_type"] === 1) role = "Manufacturer";
    if (result1.data.eventUserDatas[0]["_type"] === 2) role = "Distributor";

    setManufacturerDetails({
      name: hexToString(result1.data.eventUserDatas[0]["_name"]).slice(1),
      type: role,
      phy_add: hexToString(
        result1.data.eventUserDatas[0]["_physicalAddress"]
      ).slice(1),
      image: hexToString(result1.data.eventUserDatas[0]["_image"]),
      id: hexToString(result1.data.eventUserDatas[0]["id"]),
    });

    console.log(result1.data.eventUserDatas[0]);
  };

  const getProductDetails = async (spId) => {
    const data_ = `query MyQuery {
      eventAddSupplierProducts(where: {_spid: "${spId}"}) {
        _address
        _date
        _description
        _expiryDate
        _name
        _price
        _spid
        _timeAdded
        _unit
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();

    setSupplierProduct({
      spId: result1.data.eventAddSupplierProducts[0]["_spid"],
      name: hexToString(
        result1.data.eventAddSupplierProducts[0]["_name"]
      ).slice(1),
      unit: result1.data.eventAddSupplierProducts[0]["_unit"],
      price: result1.data.eventAddSupplierProducts[0]["_price"],
      date: new Date(
        result1.data.eventAddSupplierProducts[0]["_date"] * 1000
      ).toDateString(),
      expiryDate: new Date(
        result1.data.eventAddSupplierProducts[0]["_expiryDate"] * 1000
      ).toDateString(),
      description: hexToString(
        result1.data.eventAddSupplierProducts[0]["_description"]
      ),
    });

    // setSupplierProduct({
    //   ...supplierProduct,
    //   supplierDetails: supplierDetails,
    //   manufacturerDetails: manufacturerDetails,
    // });

    console.log(result1.data.eventAddSupplierProducts[0]);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };
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
          <TextField
            helperText=" "
            id="demo-helper-text-aligned-no-helper"
            label="Product Id"
            onChange={(e) => {
              setSmId(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              getSmId(smId);
            }}
            variant="contained"
            size="large"
            className="verify-btn"
          >
            Verify Product
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

        <div className="chain">
          <div className="chain-item">
            {supplierDetails && (
              <>
                <h3>Supplier Details</h3>

                <p>
                  <h4>Name:</h4> {supplierDetails?.name}
                </p>
                <p>
                  <h4>Physical Address:</h4> {supplierDetails?.phy_add}
                </p>
              </>
            )}
          </div>
          <div className="chain-item">
            {manufacturerDetails && (
              <>
                <h3>Manufacturer Details</h3>
                <p>
                  <h4>Name:</h4> {manufacturerDetails?.name}
                </p>
                <p>
                  <h4>Physical Address:</h4> {manufacturerDetails?.phy_add}
                </p>
              </>
            )}
          </div>
          <div className="chain-item">
            {supplierProduct && (
              <>
                <h3>Product Details</h3>
                <p>
                  <h4>Product Name:</h4> {supplierProduct?.name}
                </p>
                <p>
                  <h4>Price:</h4> {supplierProduct?.price} Matic
                </p>
                <p>
                  <h4>Produced Date:</h4> {supplierProduct?.date}
                </p>
                <p>
                  <h4>Expiry Date:</h4> {supplierProduct?.expiryDate}
                </p>
              </>
            )}
          </div>
        </div>
        <span className="shape1 header-shape">
          <img src={feature1}></img>
        </span>

        <span className="bubble3 header-shape">
          <img src={bubble4}></img>
        </span>
        <span className="bubble4 header-shape">
          <img src={bubble4}></img>
        </span>
      </div>
    </>
  );
}

export default VerifyProduct;
