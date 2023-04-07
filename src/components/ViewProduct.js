import React, { useEffect, useRef, useState } from "react";
import "../styles/deleteproduct.css";
import productData from "./ViewProduct.json";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import "../styles/viewproduct.css";
import { createClient } from "urql";
import hexToString from "./HexToStringConverter";
import { useAccount, useSigner } from "wagmi";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../config";
import supplierProduct from "../artifacts/contracts/supplierProduct.sol/supplierProduct.json";
import { getContract } from "@wagmi/core";
import { getProvider } from "@wagmi/core";
import { getSpDetails } from "../helper/GetSpDetails";

// ................
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ethers } from "ethers";

// ..............
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function ViewProduct() {
  const { address, isConnected } = useAccount();
  const [productData, setProductData] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  //---------------------------contract instance
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const connectedContract = getContract({
    address: SUPPLIERPRODUCT_CONTRACT_ADDRESS_BTTC,
    abi: supplierProduct.abi,
    signerOrProvider: signer,
  });

  const getData = async () => {
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
    setProductData(filteredData);
    setTimeout(() => setLoading(false), 1000);
    // setLoading(false);

    /* const data_ = `query MyQuery {
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

    setProductData(filteredData);
    console.log(filteredData); */
  };

  useEffect(() => {
    getData();
  }, []);

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      {modal && (
        <div className=" modal ">
          <div onClick={toggleModal} className="overlay"></div>
          <div className=" modal-content">
            <div className="first-row-product">
              <p className="product-des">{selectedProduct.description}</p>
              <button className="close-modal" onClick={toggleModal}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="availabel-proposal-main-div">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Product Id</StyledTableCell>
                <StyledTableCell align="right">Product Name</StyledTableCell>
                <StyledTableCell align="right">Unit</StyledTableCell>
                <StyledTableCell align="right">Price per unit</StyledTableCell>
                <StyledTableCell align="right">Expiry Date</StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </TableRow>
            </TableHead>
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
              <TableBody>
                {productData &&
                  productData.map((product) => (
                    <StyledTableRow key={product.spId}>
                      <StyledTableCell component="th" scope="row">
                        {product.spId}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {product.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {product.unit}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {product.price}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {product.expiryDate}
                      </StyledTableCell>
                      <div className="view-more-btn">
                        <Button
                          variant="contained"
                          size="large"
                          className="view-More"
                          onClick={() => {
                            setSelectedProduct(product);
                            toggleModal();
                          }}
                        >
                          View More
                        </Button>
                      </div>
                    </StyledTableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default ViewProduct;
