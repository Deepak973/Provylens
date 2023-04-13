import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import feature1 from "../assets/feature-1.png";
import bubble4 from "../assets/fixed4.png";
import { createClient } from "urql";
import { useAccount, useSigner } from "wagmi";
import Footer from "../components/Footer";
import hexToString from "../helper/HexToStringConverter";
//wagmi
import { getContract } from "@wagmi/core";
import { getProvider } from "@wagmi/core";

import userDetails from "../artifacts/contracts/userDetails.sol/userDetails.json";
import { USERDETAILS_CONTRACT_ADDRESS_BTTC } from "../config";

import ConnectButtonCustom from "./ConnectButtonCustom";
import { useNavigate } from "react-router-dom";

import { checkRegistration } from "../helper/userDetailsHelper";

function Profile() {
  const navigate = useNavigate();
  const provider = getProvider();
  const { address, isConnected } = useAccount();
  const [profileData, setProfileData] = useState();

  //---------------------------contract instance
  const connectedContract = getContract({
    address: USERDETAILS_CONTRACT_ADDRESS_BTTC,
    abi: userDetails.abi,
    signerOrProvider: provider,
  });

  const getData = async () => {
    // const user = await connectedContract.getSingleUser(address);
    // console.log(user);

    const user = await checkRegistration(address);
    console.log(user);

    var role = "";
    if (user.userType === 0) {
      role = "Supplier";
    } else if (user.userType === 1) {
      role = "Manufacturer";
    } else if (user.userType === 2) {
      role = "Distributor";
    }
    setProfileData({
      name: hexToString(user.userName),
      type: role,
      phy_add: hexToString(user.userPhysicalAddress),
      image: hexToString(user.userImage),
    });
  };
  console.log(profileData);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="profile-main-div">
        <div className="profile-hero-section">
          <span className="shape1 header-shape">
            <img src={feature1}></img>
          </span>
          <div className="profile-form-main">
            <div className="profile-block">
              {isConnected ? (
                profileData ? (
                  <>
                    {profileData.name !== "0x" ? (
                      <>
                        <div className="user-profile-div">
                          <img
                            src={profileData.image}
                            alt=""
                            className="profile-img"
                          />
                        </div>

                        <div className="div-profile-info">
                          <>
                            <div className="div-role-main">
                              <h3>Role : {profileData.type}</h3>
                            </div>
                            <div className="div-role-main">
                              <h3>Name : {profileData.name}</h3>
                            </div>
                            <div className="div-role-main">
                              <h3>address : {profileData.phy_add}</h3>
                            </div>
                          </>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="div-profile-info">
                          User not registered
                          <button
                            className="profile-btn"
                            onClick={() => navigate("/register")}
                          >
                            sign up
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div class="lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="div-role-main">
                    <h3>Connect Wallet first</h3>
                    <ConnectButtonCustom />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <span className="bubble3 header-shape">
          <img src={bubble4}></img>
        </span>
        <span className="bubble4 header-shape">
          <img src={bubble4}></img>
        </span>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
