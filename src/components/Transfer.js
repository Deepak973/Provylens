import React, { useEffect, useState } from "react";
import "../styles/transfer.css";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import "react-toastify/dist/ReactToastify.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "urql";
import hexToString from "./HexToStringConverter";
import { useAccount, useSigner } from "wagmi";
import { TextField } from "@mui/material";
import { ethers } from "ethers";
import { SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_MUMBAI } from "../config";
import supplierManufacturer from "../artifacts/contracts/supplierManufacturer.sol/supplierManufacturer.json";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_MUMBAI } from "../config";
import addproduct from "../artifacts/contracts/supplierProduct.sol/supplierProduct.json";

function Transfer() {
  const [allDataDaos, setDataDaos] = useState([]);
  const [manufacturerDetails, setManufacturerDetails] = useState();
  const [productDetails, setProductDetails] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState();
  const [quantity, setQuantity] = useState();
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    getManufacturerData();
    getProductData();
  }, []);

  useEffect(() => {
    console.log(selectedProduct);
  }, [selectedProduct]);

  const getProductData = async () => {
    const data_ = `query MyQuery {
      eventAddSupplierProducts(
        where: {_address: "${address.toLowerCase()}"}
      ) {
        _address
        _date
        _description
        _expiryDate
        _name
        _price
        _spid
        _timeAdded
        _unit
        blockNumber
        blockTimestamp
        id
        transactionHash
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();
    // console.log(hexToString(result1.data.eventUserDatas[0]["_name"]));
    const filteredData = result1.data.eventAddSupplierProducts.map(
      (product) => {
        return {
          spId: product["_spid"],
          name: hexToString(product["_name"]),
          unit: product["_unit"],
          price: product["_price"],
          date: new Date(product["_date"] * 1000).toDateString(),
          expiryDate: new Date(product["_expiryDate"] * 1000).toDateString(),
          description: hexToString(product["_description"]),
        };
      }
    );

    setProductDetails(filteredData);
    console.log(filteredData);
  };

  const getManufacturerData = async () => {
    const data_ = `query MyQuery {
        eventUserDatas(where: {_type: 1}) {
          _address
          _image
          _name
          _physicalAddress
          _timeUpdated
          _type
        }
      }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();
    // console.log(hexToString(result1.data.eventUserDatas[0]["_name"]));
    const filteredData = result1.data.eventUserDatas.map((product) => {
      return {
        address: product["_address"],
        name: hexToString(product["_name"]),
        physicalAddress: hexToString(product["_physicalAddress"]),
      };
    });

    setManufacturerDetails(filteredData);
    console.log(filteredData);
  };
  const encoder = new TextEncoder();
  const addTransferData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const transfer = new ethers.Contract(
        SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_MUMBAI,
        supplierManufacturer.abi,
        signer
      );

      // console.log(
      //   selectedProduct.product.spId,
      //   address,
      //   selectedManufacturer.manufacturer.address,
      //   Math.trunc(new Date().getTime() / 1000)
      // );
      const tx = await transfer.transferProduct(
        selectedProduct.product.spId,
        address,
        selectedManufacturer.manufacturer.address,
        Math.trunc(new Date().getTime() / 1000)
      );
      await tx.wait();

      const updateSupplierProductUints = new ethers.Contract(
        SUPPLIERPRODUCT_CONTRACT_ADDRESS_MUMBAI,
        addproduct.abi,
        signer
      );
      // console.log(quantity);
      const tx1 = await updateSupplierProductUints.updateSupplierProductUints(
        selectedProduct.product.spId,
        quantity
      );
      await tx1.wait();

      toastInfo();
    } catch (err) {
      console.log(err);
    }
  };

  const toastInfo = () =>
    toast.success("Tranfer Successfully", {
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
      <div className="transfer-main-div">
        <div className="all-datadao-main-div">
          <div className="first-row">
            <FormControl
              sx={{ m: 1, minWidth: 70 }}
              size="small"
              id="dropdown-formcontrol"
              className="select-parent"
            >
              <InputLabel id="select-label-status">Product</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                // value={age}
                label="Status"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    product: e.target.value,
                  })
                }
              >
                {productDetails &&
                  productDetails.map((product) => (
                    <MenuItem value={product}>{product.name} </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <div className="product-details">
              <label className="manufacture-details-quality">
                Name : {selectedProduct?.product.name}
              </label>
              <label className="manufacture-details-quality">
                Price : {selectedProduct?.product.price} Matic
              </label>
              <label className="manufacture-details-quality">
                Unit : {selectedProduct?.product.unit}
              </label>
              <label className="manufacture-details-quality">
                Description : {selectedProduct?.product.description}
              </label>
            </div>
          </div>
          <div className="second-row">
            <FormControl
              sx={{ m: 1, minWidth: 70 }}
              size="small"
              id="dropdown-formcontrol"
              className="select-parent"
            >
              <InputLabel id="select-label-status">Manufacturer</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                // value={age}
                onChange={(e) =>
                  setSelectedManufacturer({
                    ...selectedManufacturer,
                    manufacturer: e.target.value,
                  })
                }
                label="Status"
              >
                {manufacturerDetails &&
                  manufacturerDetails.map((manufacturer) => (
                    <MenuItem value={manufacturer}>
                      {manufacturer.name}{" "}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <div className="manufacture-details">
              <label className="manufacture-details-quality">
                Manufacturer details
              </label>
              <label className="manufacture-details-quality">
                Name :{selectedManufacturer?.manufacturer.name}
              </label>
              <label className="manufacture-details-quality">
                {selectedManufacturer?.manufacturer.physicalAddress}
              </label>
            </div>
          </div>
          <div className="third-row">
            {" "}
            <FormControl
              sx={{ m: 1, minWidth: 70 }}
              size="small"
              id="dropdown-formcontrol"
              className="select-parent"
            >
              <TextField
                id="standard-basic"
                label="Unit"
                variant="standard"
                onChange={(e) => {
                  setAmount(e.target.value * selectedProduct?.product.price);
                  setQuantity(e.target.value);
                }}
              />
            </FormControl>
            <div className="manufacture-details">
              <label className="manufacture-details-quality">
                Total Amount : {amount ? amount + " Matic" : "--"}
              </label>
            </div>
          </div>
        </div>
        <Button
          variant="contained"
          size="large"
          className="transfer-btn"
          onClick={() => addTransferData()}
        >
          Transfer
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
export default Transfer;
