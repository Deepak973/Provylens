import React, { useEffect, useState } from "react";
import "../styles/transfer.css";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import "../styles/Modal.css";
import history from "./TransferHistory.json";
import { createClient } from "urql";
import { useAccount, useSigner } from "wagmi";

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
  const [transferDetails, setTransferDetails] = useState();

  console.log(history);
  const toggleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    getTransferData();
  }, []);
  const getTransferData = async () => {
    const data_ = `query MyQuery {
      eventSupplierManufacturerTransfers(
        where: {_supplierAddress: "${address.toLowerCase()}"}
      ) {
        _dispatchTime
        _manufacturerAddress
        _smId
        _spId
        _supplierAddress
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();
    // console.log(hexToString(result1.data.eventUserDatas[0]["_name"]));
    const filteredData = result1.data.eventSupplierManufacturerTransfers.map(
      (product) => {
        return {
          dispatchTime: new Date(
            product["_dispatchTime"] * 1000
          ).toDateString(),
          manufacturerAddress: product["_manufacturerAddress"],
          smId: product["_smId"],
          spId: product["_spId"],
          supplierAddress: product["supplierAddress"],
        };
      }
    );

    setTransferDetails(filteredData);
    console.log(filteredData);
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
                {history.Product}
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
                {history.Manufacturer}
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
                {history.quality}
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
        {transferDetails &&
          transferDetails.map((data) => {
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
                          Transfer Id:{data?.smId}
                        </label>
                        <label className="transfer-history">
                          product Id:{data?.spId}
                        </label>
                        <label className="transfer-history">
                          Dispatch Time:{data?.dispatchTime}
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
                          onClick={toggleModal}
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
