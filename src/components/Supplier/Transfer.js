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
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Grid from "@mui/material/Grid";

import hexToString from "../../helper/HexToStringConverter";
import { useAccount, useSigner } from "wagmi";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import { ethers } from "ethers";
import { SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_MUMBAI } from "../../config";
import supplierManufacturer from "../../artifacts/contracts/supplierManufacturer.sol/supplierManufacturer.json";
import { SUPPLIERPRODUCT_CONTRACT_ADDRESS_MUMBAI } from "../../config";
import addproduct from "../../artifacts/contracts/supplierProduct.sol/supplierProduct.json";
import { getSpDetails } from "../../helper/GetSpDetails";
import { getAllManufacturers } from "../../helper/userDetailsHelper";
import { requestHistoryOfSupplier } from "../../helper/supplierManufacturerHelper";
import { transferProductToManufacturer } from "../../helper/supplierManufacturerHelper";

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Transfer() {
  const [manufacturerDetails, setManufacturerDetails] = useState();
  const [productDetails, setProductDetails] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState();
  const [quantity, setQuantity] = useState();
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState();

  useEffect(() => {
    getTransferData();
  }, []);

  const getTransferData = async () => {
    const reqHistory = await requestHistoryOfSupplier(
      "0x9b4716573622751e7F6a56da251D054b6BBa4B00"
    );
    console.log(reqHistory);
    const filteredData = reqHistory.map((val, index) => {
      if (val["status"] === 1) {
        return {
          reqId: parseInt(val["smId"]),
          spId: parseInt(val["spId"]),
          // name: hexToString(val["userName"]),
          status:
            val["status"] === 1
              ? "Requested"
              : val["status"] === 2
              ? "Approved"
              : val["status"] === 3
              ? "Received"
              : null,
          quantity: val["quantity"],
          manufacturerAddress: val["manufacturerAddress"],
        };
      } else {
        return null;
      }
    });
    setRequestDetails(filteredData);

    console.log(filteredData);
    // console.log(reqHistory);
  };

  const encoder = new TextEncoder();
  const transferData = async (i) => {
    console.log(requestDetails[i]);
    transferProductToManufacturer(
      requestDetails[0].reqId,
      requestDetails[0].manufacturerAddress,
      requestDetails[0].quantity,
      requestDetails[0].quantity
    );
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
      {/* <div className="transfer-main-div">
        {requestDetails &&
          requestDetails.map((data, i) => {
            return (
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={8}>
                    <Item>
                      {" "}
                      <div className="history-flex">
                        <label className="transfer-history">
                          Requeset Id:{data?.reqId}
                        </label>
                        <label className="transfer-history">
                          product Id:{data?.spId}
                        </label>
                        <label className="transfer-history">
                          Request Status:{data?.status}
                        </label>
                        <label className="transfer-history">
                          Quantity:{data?.quantity}
                        </label>
                      </div>
                      <div></div>
                    </Item>
                    <Button
                      variant="contained"
                      size="large"
                      className="transfer-btn"
                      onClick={() => transferData(i)}
                    >
                      Transfer
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            );
          })}

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
      </div> */}

      <div className="availabel-proposal-main-div">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Request Id</StyledTableCell>
                <StyledTableCell align="right">Product Id</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">
                  Manufacturer address
                </StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
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
                {requestDetails &&
                  requestDetails.map((requestDetails) => (
                    <StyledTableRow key={requestDetails.reqId}>
                      <StyledTableCell component="th" scope="row">
                        {requestDetails.reqId}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.spId}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.manufacturerAddress}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.status}
                      </StyledTableCell>
                      <div className="view-more-btn">
                        <Button
                          variant="contained"
                          size="large"
                          className="view-More"
                          onClick={() => {
                            transferData();
                          }}
                        >
                          Transfer Product
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
export default Transfer;
