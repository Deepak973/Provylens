import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, CardActions } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import "../styles/register.scss";
import Navbar from "./Navbar";
import { Input } from "@mui/material";
import { ethers } from "ethers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import feature1 from "../assets/feature-1.png";
import bubble4 from "../assets/fixed4.png";
import { USERDETAILS_CONTRACT_ADDRESS_MUMBAI } from "../config";
import userdetails from "../artifacts/contracts/userDetails.sol/userDetails.json";
import { useAccount } from "wagmi";

function Register() {
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState({
    userType: "",
    name: "",
    physcialAddress: "",
    profileImage: "",
  });
  const toastInfo = () =>
    toast.success("Register Successfully", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const registerUser = async () => {
    const encoder = new TextEncoder();

    // start of "getting the data from user"/////////////////////////////////////////////////////////////////////////////
    const form = new FormData();
    form.append("file", userData.profileImage);

    const options = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/files",
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=---011000010111000001101001",
        Authorization: "3a00a5ae-f74a-4369-820d-8da1cc435690",
      },
      data: form,
    };
    console.log(options);
    var imageUri;
    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        console.log(response.data.ipfs_url);

        imageUri = response.data.ipfs_url;
      })
      .catch(function (error) {
        console.error(error);
      });

    userData.profileImage = imageUri;

    //End of "getting the data from user"/////////////////////////////////////////////////////////////////////////////

    //Start of "contract Interaction for storing userdata"/////////////////////////////////////////////////////////////////////////////

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const registerUser = new ethers.Contract(
        USERDETAILS_CONTRACT_ADDRESS_MUMBAI,
        userdetails.abi,
        signer
      );

      const tx = await registerUser.addUser(
        userData.userType,
        encoder.encode(userData.name),
        encoder.encode(userData.physcialAddress),
        encoder.encode(userData.profileImage)
      );
      await tx.wait();
      toastInfo();
      setTimeout(() => {
        navigate("/");
      }, [5000]);
    } catch (err) {
      console.log(err);
    }

    //End of "contract Interaction for storing userdata"/////////////////////////////////////////////////////////////////////////////
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUserData({
      ...userData,
      profileImage: selectedFile,
    });
  };
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [address]);

  useEffect(() => {
    // console.log(userData);
  }, [userData]);

  return (
    <>
      <div className="register-main-div">
        <div className="register-main">
          <h1 className="register-title">Register Here</h1>
          <FormControl
            sx={{ m: 1, minWidth: 70 }}
            size="small"
            id="dropdown-formcontrol"
            className="select-parent"
          >
            <InputLabel id="select-label-status">Select role</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              // value={age}
              label="Status"
              // onChange={handleChange}
              onChange={(e) => {
                setUserData({ ...userData, userType: e.target.value });
              }}
            >
              <MenuItem value={0}>Supplier </MenuItem>
              <MenuItem value={1}>Manufacturer </MenuItem>
              <MenuItem value={2}>Distributor</MenuItem>
            </Select>
          </FormControl>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
            className="register-file"
          >
            <lable
              style={{ color: " rgba(255, 255, 255, 0.5)" }}
              className="profile-lbl"
            >
              Set Profile Image
            </lable>
            <TextField
              type="file"
              label=""
              onChange={handleFileChange}
              inputProps={{ accept: "image/*" }}
              className="input-edit-profile"
              id="register-file"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="upload-image"
                style={{ width: "100px", height: "200px", marginTop: "1rem" }}
              />
            )}

            {/* <Input
              type="file"
              onChange={(e) => {
                setUserData({
                  ...userData,
                  profileImage: e.target.files[0],
                });
              }}
            /> */}
          </Box>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Name"
              variant="standard"
              onChange={(e) => {
                setUserData({ ...userData, name: e.target.value });
              }}
            />
          </Box>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Address"
              variant="standard"
              onChange={(e) => {
                setUserData({ ...userData, physcialAddress: e.target.value });
              }}
            />
          </Box>

          <button
            className="register-btn"
            onClick={() => {
              registerUser();
            }}
          >
            Register
          </button>
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
        <span className="shape1 header-shape">
          <img src={feature1} className="register-bgimg"></img>
        </span>

        <span className="bubble3 header-shape">
          <img src={bubble4}></img>
        </span>
        <span className="bubble4 header-shape">
          <img src={bubble4}></img>
        </span>
      </div>
    </>
  );
}

export default Register;
