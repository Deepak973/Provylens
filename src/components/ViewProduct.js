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

// ................
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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

function createData(id, name, unit, price) {
  return { id, name, unit, price };
}

const rows = [
  createData("1", "Apollo", 500, 1000),
  createData("1", "Apollo", 500, 1000),
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function ViewProduct() {
  const { address, isConnected } = useAccount();
  const [productData, setProductData] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const getData = async () => {
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
    console.log(filteredData);
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
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default ViewProduct;
