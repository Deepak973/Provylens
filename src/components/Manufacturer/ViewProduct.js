import React, { useEffect, useRef, useState } from "react";
import "../../styles/deleteproduct.css";
// import productData from "././ViewProduct.json";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import "../../styles/viewproduct.css";
import { createClient } from "urql";
import hexToString from "../../helper/HexToStringConverter";
import { useAccount, useSigner } from "wagmi";
import { MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../../config";
import manufacturerProduct from "../../artifacts/contracts/manufacturerProduct.sol/manufacturerProduct.json";
import { getContract } from "@wagmi/core";
import { getProvider } from "@wagmi/core";
import { getSpDetails } from "../../helper/GetSpDetails";

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
    backgroundColor: "#1a1156",
    color: theme.palette.common.white,
    textAlign: "center",
    letterSpacing: "2px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
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
    address: MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC,
    abi: manufacturerProduct.abi,
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
                <StyledTableCell
                  align="center"
                  sx={{ width: "130px", textAlign: "center" }}
                >
                  Product Id
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: "400px" }}>
                  Product Name
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: "130px" }}>
                  Unit
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: "150px" }}>
                  Price per unit
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: "300px" }}>
                  Expiry Date
                </StyledTableCell>
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
                      <StyledTableCell align="center">
                        {product.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product.price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
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
