import React, { useState, useEffect, useRef } from "react";
import "../styles/requeststock.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { useAccount, useSigner } from "wagmi";

function RequestStock({ dashboardLinks }) {
  const { address, isConnected } = useAccount();
  // const PK = process.env.PRIVATE_KEY; // channel private key
  // const Pkey = `0x${PK}`;
  // const _signer = new ethers.Wallet(Pkey);

  //push integration
  //send notification
  const sendNotification = async () => {
    const PK = process.env.REACT_APP_PRIVATE_KEY; // channel private key
    const Pkey = `0x3a1c06e0cbba867974a15a0fcc81f78e316065d0dc8e242895add8cdc5bda6ca`;
    const _signer = new ethers.Wallet(Pkey);
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer: _signer,
        type: 1, // broadcast
        identityType: 2, // direct payload
        notification: {
          title: `[SDK-TEST] request material`,
          body: `[sdk-test] request material for medicene`,
        },
        payload: {
          title: `[sdk-test] Request materila`,
          body: `request material for medicene`,
          cta: "",
          img: "",
        },
        recipients: `eip155:80001:${address}`, // recipient address
        channel: "eip155:80001:0x97861976283e6901b407D1e217B72c4007D9F64D", // your channel address
        env: "staging",
      });
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  const requeststock = async () => {
    await sendNotification();
    toastInfo();
  };
  const toastInfo = () =>
    toast.success("Request Successfully", {
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
      <div className="datadao-details-main-div">
        <FormControl
          sx={{ m: 1, minWidth: 70 }}
          size="small"
          id="dropdown-formcontrol"
          className="select-parent"
        >
          <InputLabel id="select-label-status">Product Name</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            // value={age}
            label="Status"
            // onChange={handleChange}
          >
            <MenuItem value={10}>abc </MenuItem>
            <MenuItem value={30}>xyz</MenuItem>
          </Select>
        </FormControl>
        <TextField
          helperText=" "
          id="demo-helper-text-aligned-no-helper"
          label="Quality"
        />
        <Button
          onClick={() => {
            requeststock();
          }}
          variant="contained"
          size="large"
          className="request-btn"
        >
          Request
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
export default RequestStock;
