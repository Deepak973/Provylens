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
import { requestHistoryOfManufacturer } from "../../helper/supplierManufacturerHelper";
import { getSingleSupplierProduct } from "../../helper/supplierProductHelper";
import hexToString from "../../helper/HexToStringConverter";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
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
  const getTransferData = async () => {
    const reqHistory = await requestHistoryOfManufacturer(address);
    console.log(reqHistory);
    const filteredData = reqHistory.map((val, index) => {
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
      {modal && (
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
      )}
      <div className="all-history-main-div">
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
                          Requeset Id:{data?.reqId}
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
      </div>
    </>
  );
}

export default TransferHistory;
