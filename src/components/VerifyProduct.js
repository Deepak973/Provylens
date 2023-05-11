import React, { useEffect, useState,useRef } from "react";
import Tree from "react-d3-tree";
import hexToString from "../helper/HexToStringConverter";
import { getProductsOfManufacturer } from "../helper/GetMpDetails";
import { useParams } from "react-router-dom";
import "../styles/deleteproduct.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import feature1 from "../assets/feature-1.png";
import bubble4 from "../assets/fixed4.png";
import feature2 from "../assets/header6_shape_5.png";
import "../styles/viewproduct.css";
import "../styles/Verifyproduct.css";
import { createClient } from "urql";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";
// ...graph.......... 
import { ForceGraph2D } from "react-force-graph";
import { details } from "./verifyDetails";
import { QRCodeCanvas } from "qrcode.react";
import img from "../assets/ProvyLensLogo.png";

const OrgChartTree = () => {
  const [dataDMMP, setdataDMMP] = useState();
  const [dataSSP, setdataSSP] = useState();
  const [loading, setLoading] = useState(false);
  // const [productData, setProductData] = useState({});
  const [productId, setProductId] = useState(false);


  
  let { id } = useParams();
  console.log(id);

  const getProductDetails = async (smId) => {
    setLoading(false);
    console.log(smId);
    const allData = await getProductsOfManufacturer(smId);
    console.log(allData);
    const filterData = {
      //manufactureProduct details
      manufacturedProductName: hexToString(allData[0]["mp_name"]).replace(
        /\0/g,
        ""
      ),
      manufacturedProductDesription: hexToString(
        allData[0]["mp_description"]
      ).replace(/\0/g, ""),
      manufacturedProductPrice: parseInt(allData[0]["mp_price"]),
      manufacturedProductManufactureDate: new Date(
        allData[0]["mp_date"] * 1000
      ).toDateString(),
      manufacturedProductExpiryDate: new Date(
        allData[0]["mp_expiryDate"] * 1000
      ).toDateString(),
      manufacturedProductDispatchDate: new Date(
        allData[0]["dispatchTime"] * 1000
      ).toDateString(),
      //manufacture details
      manufactureName: hexToString(allData[2]["userName"]).replace(/\0/g, ""),
      manufacturerAddress: hexToString(
        allData[2]["userPhysicalAddress"]
      ).replace(/\0/g, ""),
      manufactureLogo: hexToString(allData[2]["userImage"]).replace(/\0/g, ""),
      //distributor details
      distributorName: hexToString(allData[3]["userName"]).replace(/\0/g, ""),
      distributorAddress: hexToString(
        allData[3]["userPhysicalAddress"]
      ).replace(/\0/g, ""),
      distributorLogo: hexToString(allData[3]["userImage"]).replace(/\0/g, ""),
    };
    console.log(filterData);

    const filteredDataOfSupplier = allData[1].map((val, index) => {
      return {
        //supplier Product details
        supplierProductName: hexToString(val[1]["sp_name"]).replace(/\0/g, ""),
        supplierProductDescription: hexToString(
          val[1]["sp_description"]
        ).replace(/\0/g, ""),
        supplierProductExpiryDate: new Date(
          val[1]["sp_expiryDate"] * 1000
        ).toDateString(),
        supplierProductCreatedDate: new Date(val[1]["sp_date"]).toDateString(),
        supplierProductDispatchTime: new Date(
          val[0]["dispatchTime"] * 1000
        ).toDateString(),
        supplierProductDispatchTime: new Date(
          val[0]["arrivalTime"] * 1000
        ).toDateString(),

        //supplier details
        supplierName: hexToString(val[2]["userName"]).replace(/\0/g, ""),
        supplierAddress: hexToString(val[2]["userPhysicalAddress"]).replace(
          /\0/g,
          ""
        ),
        supplierLogo: hexToString(val[2]["userImage"]).replace(/\0/g, ""),
      };
    });
    console.log(filteredDataOfSupplier);
    setdataDMMP(filterData);
    setdataSSP(filteredDataOfSupplier);
    setLoading(true);
  };

  //data
  const orgChart = {
    name: "Product",
    attributes: {
      productname: dataDMMP?.manufacturedProductName,
      description: dataDMMP?.manufacturedProductDesription,
      manufactureddate: dataDMMP?.manufacturedProductManufactureDate,
      expirydate: dataDMMP?.manufacturedProductExpiryDate,
    },
    children: [
      {
        name: "Distributor",
        attributes: {
          name: dataDMMP?.distributorName,
          address: dataDMMP?.distributorAddress,
          // logo: "logo",
        },
        children: [
          {
            name: "Manufacture",
            attributes: {
              name: dataDMMP?.manufactureName,
              address: dataDMMP?.manufacturerAddress,
              // logo: "logo",
            },
            children: [
              {
                name: "Supplier Raw Product",
                attributes: {
                  productname: dataSSP ? dataSSP[0]?.supplierProductName : "",
                  description: dataSSP
                    ? dataSSP[0]?.supplierProductDescription.slice(0, 20)
                    : "",
                  manufactureddate: dataSSP
                    ? dataSSP[0]?.supplierProductCreatedDate
                    : "",
                  expirydate: dataSSP
                    ? dataSSP[0]?.supplierProductExpiryDate
                    : "",
                  dispatchTime: dataSSP
                    ? dataSSP[0]?.supplierProductDispatchTime
                    : "",
                },
                children: [
                  {
                    name: "Raw Product Supplier Details",
                    attributes: {
                      name: dataSSP ? dataSSP[0]?.supplierName : "",
                      address: dataSSP ? dataSSP[0]?.supplierAddress : "",
                      // logo: "logo",
                    },
                  },
                ],
              },
              {
                name: "Supplier Raw Product 2",
                attributes: {
                  productname: dataSSP ? dataSSP[1]?.supplierProductName : "",
                  description: dataSSP
                    ? dataSSP[1]?.supplierProductDescription.slice(0, 30)
                    : "",
                  manufactureddate: dataSSP
                    ? dataSSP[1]?.supplierProductCreatedDate
                    : "",
                  expirydate: dataSSP
                    ? dataSSP[1]?.supplierProductExpiryDate
                    : "",
                  dispatchTime: dataSSP
                    ? dataSSP[1]?.supplierProductDispatchTime
                    : "",
                },
                children: [
                  {
                    name: "Raw Product Details",
                    attributes: {
                      name: dataSSP ? dataSSP[1]?.supplierName : "",
                      address: dataSSP ? dataSSP[1]?.supplierAddress : "",
                      // logo: "logo",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const orientationProps = {
    orientation: 'vertical',
    translate: { x: 300, y: 50 },
    nodeSize: { x: 150, y: 100 },
  };
  useEffect(() => {
    getProductDetails(id);
  }, []);

  
  
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <>
      {!id ? (
        <div className="verify-product-main-div">
          <div className="verify-product-main ">
            <TextField
              helperText=" "
              id="demo-helper-text-aligned-no-helper"
              label="Product Id"
              sx={{
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "..MuiOutlinedInput-input.Mui-focused": {
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
              onChange={(e) => {
                setProductId(e.target.value);
              }}
            />

            <Button
              onClick={() => {
                getProductDetails(productId);
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
        </div>
      ) : null}

      <div
        id="treeWrapper"
        style={{
          width: "100vw",
          height: "100vh",
          padding: "20px",
        }}
      >
        {loading ? (
          <Tree
            data={orgChart}
            // orientation="vertical"
            translate={{ x: 100, y: 180 }}
            {...orientationProps}
            separation={{ siblings: 2, nonSiblings: 2 }}
          />
        ) : (
          ""
        )}
      </div>
      <span className="shape1-product header-shape-product">
          <img src={feature1} className="verify-product-img"></img>
        </span>
        
      <Footer />
    </>
  );
};

export default OrgChartTree;
