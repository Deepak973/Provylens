import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import hexToString from "../helper/HexToStringConverter";
import { getProductsOfManufacturer } from "../helper/GetMpDetails";

const OrgChartTree = () => {
  const [dataDMMP, setdataDMMP] = useState();
  const [dataSSP, setdataSSP] = useState();

  const getProductDetails = async (smId) => {
    console.log(smId);
    const allData = await getProductsOfManufacturer(smId);
    console.log(allData);
    const filterData = {
      //manufactureProduct details
      manufacturedProductName: hexToString(allData[0]["mp_name"]),
      manufacturedProductDesription: hexToString(allData[0]["mp_description"]),
      manufacturedProductPrice: parseInt(allData[0]["mp_price"]),
      manufacturedProductManufactureDate: new Date(
        allData[0]["mp_date"]
      ).toDateString(),
      manufacturedProductExpiryDate: new Date(
        allData[0]["mp_expiryDate"]
      ).toDateString(),
      manufacturedProductDispatchDate: new Date(
        allData[0]["dispatchTime"]
      ).toDateString(),
      //manufacture details
      manufactureName: hexToString(allData[2]["userName"]),
      manufacturerAddress: hexToString(allData[2]["userPhysicalAddress"]),
      manufactureLogo: hexToString(allData[2]["userImage"]),
      //distributor details
      distributorName: hexToString(allData[3]["userName"]),
      distributorAddress: hexToString(allData[3]["userPhysicalAddress"]),
      distributorLogo: hexToString(allData[3]["userImage"]),
    };
    console.log(filterData);
    setdataDMMP(filterData);

    const filteredDataOfSupplier = allData[1].map((val, index) => {
      return {
        //supplier Product details
        supplierProductName: hexToString(val[1]["sp_name"]),
        supplierProductDescription: hexToString(val[1]["sp_description"]),
        supplierProductExpiryDate: new Date(
          val[1]["sp_expiryDate"]
        ).toDateString(),
        supplierProductCreatedDate: new Date(val[1]["sp_date"]).toDateString(),
        supplierProductDispatchTime: new Date(
          val[0]["dispatchTime"]
        ).toDateString(),
        supplierProductDispatchTime: new Date(
          val[0]["arrivalTime"]
        ).toDateString(),

        //supplier details
        supplierName: hexToString(val[2]["userName"]),
        supplierAddress: hexToString(val[2]["userPhysicalAddress"]),
        supplierLogo: hexToString(val[2]["userImage"]),
      };
    });
    console.log(filteredDataOfSupplier);
    setdataSSP(filteredDataOfSupplier);
  };
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
          logo: "logo",
        },
        children: [
          {
            name: "Manufacture",
            attributes: {
              name: dataDMMP?.manufactureName,
              address: dataDMMP?.manufacturerAddress,
              logo: "logo",
            },
            children: [
              {
                name: "Supplier Raw Product",
                attributes: {
                  productname: dataSSP[0]?.supplierProductName,
                  description: dataSSP[0]?.supplierProductDescription,
                  manufactureddate: dataSSP[0]?.supplierProductCreatedDate,
                  expirydate: dataSSP[0]?.supplierProductExpiryDate,
                  dispatchTime: dataSSP[0]?.supplierProductDispatchTime,
                },
                children: [
                  {
                    name: "Raw Product Details",
                    attributes: {
                      name: dataSSP[0]?.supplierName,
                      address: dataSSP[0]?.supplierAddress,
                      logo: "logo",
                    },
                  },
                ],
              },
              {
                name: "Supplier Raw Product 2",
                attributes: {
                  productname: dataSSP[0]?.supplierProductName,
                  description: dataSSP[0]?.supplierProductDescription,
                  manufactureddate: dataSSP[0]?.supplierProductCreatedDate,
                  expirydate: dataSSP[0]?.supplierProductExpiryDate,
                  dispatchTime: dataSSP[0]?.supplierProductDispatchTime,
                },
                children: [
                  {
                    name: "Raw Product Details",
                    attributes: {
                      name: dataSSP[0]?.supplierName,
                      address: dataSSP[0]?.supplierAddress,
                      logo: "logo",
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
  useEffect(() => {
    getProductDetails(1);
  }, []);
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div
      id="treeWrapper"
      style={{
        width: "100vw",
        height: "100vh",
        padding: "20px",
        paddingTop: "100px",
      }}
    >
      <Tree
        data={orgChart}
        orientation="vertical"
        translate={{ x: 400, y: 50 }}
      />
    </div>
  );
};

export default OrgChartTree;
