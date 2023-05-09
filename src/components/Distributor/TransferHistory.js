import React, { useEffect, useState } from "react";
import "../../styles/transfer.css";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import "../../styles/Modal.css";
import history from "../TransferHistory.json";
import { createClient } from "urql";
import { useAccount, useSigner } from "wagmi";
import { requestHistoryOfDistributor } from "../../helper/manufacturerDistributorHelper";
import { receiveProduct } from "../../helper/manufacturerDistributorHelper";
import { getSingleSupplierProduct } from "../../helper/supplierProductHelper";
import hexToString from "../../helper/HexToStringConverter";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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

function TransferHistory({ dashboardLinks }) {
  const { address, isConnected } = useAccount();
  const [modal, setModal] = useState(false);
  const [requestDetails, setRequestDetails] = useState();
  // const [spId, setSpId] = useState();

  console.log(history);
  const toggleModal = () => {
    setModal(!modal);
    // console.log(spId);
  };

  useEffect(() => {
    getTransferData();
  }, []);

  const updateStatus = async (mpId, mdId) => {
    receiveProduct(mpId, mdId);
  };
  const getTransferData = async () => {
    // const reqHistory = await requestHistoryOfManufacturer(address);
    // console.log(reqHistory);
    // const filteredData = reqHistory.map((val, index) => {
    //   return {
    //     reqId: parseInt(val[0]["smId"]),
    //     spId: parseInt(val[0]["spId"]),
    //     // name: hexToString(val["userName"]),
    //     status:
    //       val[0]["status"] === 1
    //         ? "Requested"
    //         : val[0]["status"] === 2
    //         ? "Approved"
    //         : val[0]["status"] === 3
    //         ? "Received"
    //         : null,
    //     quantity: val[0]["quantity"],
    //     productname: hexToString(val[1]["sp_name"]),
    //     p_description: hexToString(val[1]["sp_description"]),
    //     p_expiry_date: new Date(val[1]["sp_expiryDate"]).toDateString(),
    //     p_date_created: new Date(val[1]["sp_date"]).toDateString(),
    //     supplier_name: hexToString(val[2]["userName"]),
    //   };
    // });

    const reqHistory = await requestHistoryOfDistributor(address);
    console.log(reqHistory);
    const filteredData = reqHistory.map((val, index) => {
      return {
        mdId: parseInt(val["mdId"]),
        mpId: parseInt(val["mpId"]),
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
        // productname: hexToString(val["sp_name"]),
        // p_description: hexToString(val["sp_description"]),
        // p_expiry_date: new Date(val["sp_expiryDate"]).toDateString(),
        // p_date_created: new Date(val["sp_date"]).toDateString(),
        supplier_name: val["m_address"],
      };
    });
    setRequestDetails(filteredData);

    console.log(filteredData);
    // console.log(reqHistory);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  return (
    <>
      {/* {modal && (
        <div className=" modal ">
          <div onClick={toggleModal} className="overlay"></div>
          <div className=" modal-content">
            <div className="first-row">
              <label className="manufacture-details-quality-title font-color">
                Product Details
              </label>
              <div className="product-details font-color">
                <label className="manufacture-details-quality">
                  Total Quality : {history.totalQuality}
                </label>
                <label className="manufacture-details-quality">
                  Current Price : {history.price}
                </label>
              </div>
            </div>
            <div className="second-row">
              <label className="manufacture-details-quality-title font-color">
                Supplier Details
              </label>
              <div className="manufacture-details font-color">
                <label className="manufacture-details-quality">
                  {history.name}
                </label>
                <label className="manufacture-details-quality">
                  {history.address}
                </label>
                <label className="manufacture-details-quality"></label>
              </div>
            </div>
            <div className="third-row">
              <label className="manufacture-details-quality-title font-color">
                Quantity
              </label>{" "}
              <div className="manufacture-details font-color">
                <label className="manufacture-details-quality">25%</label>
              </div>
            </div>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )} */}
      {/* <div className="all-history-main-div">
        {requestDetails &&
          requestDetails.map((data) => {
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
                          Requeset Id:{data?.mdId}
                        </label>
                        <label className="transfer-history">
                          product Id:{data?.spId}
                        </label>
                        <label className="transfer-history">
                          Request Status:{data?.status}
                        </label>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          size="large"
                          className="transfer-history-btn"
                          // onClick={() => {
                          //   dashboardLinks("HistoryDetails");
                          // }}
                          onClick={() => {
                            toggleModal();
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
      </div> */}

      <div className="availabel-proposal-main-div">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Request Id</StyledTableCell>
                <StyledTableCell align="right">Product Name</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">
                  Manufacturer Name
                </StyledTableCell>
                <StyledTableCell align="right">Current Status</StyledTableCell>
                <StyledTableCell align="right">Update Status</StyledTableCell>
              </TableRow>
            </TableHead>
            {false ? (
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
                    <StyledTableRow key={requestDetails.mdId}>
                      <StyledTableCell component="th" scope="row">
                        {requestDetails.mdId}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.mpId}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.supplier_name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {requestDetails.status}
                      </StyledTableCell>
                      {requestDetails.status === "Received" ||
                      requestDetails.status === "Requested" ? null : (
                        <div
                          className="view-more-btn"
                          onClick={() => {
                            updateStatus(
                              requestDetails.mpId,
                              requestDetails.mdId
                            );
                          }}
                        >
                          Receive
                        </div>
                      )}
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

export default TransferHistory;
