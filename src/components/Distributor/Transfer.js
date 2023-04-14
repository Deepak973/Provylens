import React, { useEffect, useState } from "react";
import "../../styles/transfer.css";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import "react-toastify/dist/ReactToastify.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "urql";
import hexToString from "../../helper/HexToStringConverter";
import { useAccount, useSigner } from "wagmi";
import { TextField } from "@mui/material";
import { ethers } from "ethers";
import { SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC } from "../../config";
import supplierManufacturer from "../../artifacts/contracts/supplierManufacturer.sol/supplierManufacturer.json";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../../config";
import addproduct from "../../artifacts/contracts/supplierProduct.sol/supplierProduct.json";
import { getSpDetails } from "../../helper/GetSpDetails";
import { getAllManufacturers } from "../../helper/userDetailsHelper";

function Transfer() {
  const [manufacturerDetails, setManufacturerDetails] = useState();
  const [productDetails, setProductDetails] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState();
  const [quantity, setQuantity] = useState();
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getManufacturerData();
    getProductData();
  }, []);

  useEffect(() => {
    console.log(selectedProduct);
  }, [selectedProduct]);

  const getProductData = async () => {
    setLoading(true);
    const allProductsData = await getSpDetails(address);
    console.log(allProductsData);
    console.log(parseInt(allProductsData[1][0]["_hex"]));

    const filteredData = allProductsData[0]
      .map((product, index) => {
        if (product["sp_status"]) {
          return {
            spId: parseInt(allProductsData[1][index]["_hex"]),
            name: hexToString(product["sp_name"]),
            unit: parseInt(product["sp_unit"]),
            price: parseInt(product["sp_price"]),
            date: new Date(product["sp_date"]).toDateString(),
            expiryDate: new Date(product["sp_expiryDate"]).toDateString(),
            description: hexToString(product["sp_description"]),
          };
        } else {
          return null;
        }
      })
      .filter((product) => product !== null);
    console.log(filteredData);
    setProductDetails(filteredData);
    setTimeout(() => setLoading(false), 1000);
    // setLoading(false);
  };

  const getManufacturerData = async () => {
    setLoading(true);
    const allManufacturerData = await getAllManufacturers();
    console.log(allManufacturerData);

    // const filteredData = allManufacturerData.map((product) => {
    //   return {
    //     address: product["_address"],
    //     name: hexToString(product["_name"]),
    //     physicalAddress: hexToString(product["_physicalAddress"]),
    //   };
    // });

    // setManufacturerDetails(filteredData);
    // console.log(filteredData);
  };
  const encoder = new TextEncoder();
  const addTransferData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const transfer = new ethers.Contract(
        SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_BTTC,
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
        SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC,
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
                sx={{
                  ".MuiInput-root:before": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },

                  ".MuiInput-root:after": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  ".MuiInput-input ": {
                    color: "white",
                    fontFamily: "HammersmithOne-Regular",
                  },
                  ".MuiInputLabel-root ": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "HammersmithOne-Regular",
                  },
                  ".MuiInputLabel-root.Mui-focused ": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontFamily: "HammersmithOne-Regular",
                  },
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
