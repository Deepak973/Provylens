import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import feature1 from "../assets/feature-1.png";
import bubble4 from "../assets/fixed4.png";
import { createClient } from "urql";
import { useAccount, useSigner } from "wagmi";
import hexToString from "./HexToStringConverter";
//wagmi
import { getContract } from "@wagmi/core";
import { getProvider } from "@wagmi/core";

import userDetails from "../artifacts/contracts/userDetails.sol/userDetails.json";
import { USERDETAILS_CONTRACT_ADDRESS_BTTC } from "../config";

import ConnectButtonCustom from "./ConnectButtonCustom";
import { useNavigate } from "react-router-dom";

import { checkRegistration } from "./CheckRegistration";

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

    /* console.log(user.userImage);
    console.log(user.userName);
    console.log(user.userPhysicalAddress);
    console.log(user.userStatus);
    console.log(user.userType); */

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
    /* const data_ = `query MyQuery {
      eventUserDatas(where: {_address: "${address.toLowerCase()}"}) {
        _image
        _name
        _physicalAddress
        _timeUpdated
        _type
        blockNumber
        blockTimestamp
        id
        transactionHash
        _address
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();
    // console.log(hexToString(result1.data.eventUserDatas[0]["_name"]));
    var role = "";
    if (result1.data.eventUserDatas[0]["_type"] === 0) role = "Supplier";
    if (result1.data.eventUserDatas[0]["_type"] === 1) role = "Manufacturer";
    if (result1.data.eventUserDatas[0]["_type"] === 2) role = "Distributor";

    setProfileData({
      name: hexToString(result1.data.eventUserDatas[0]["_name"]),
      type: role,
      phy_add: hexToString(result1.data.eventUserDatas[0]["_physicalAddress"]),
      image: hexToString(result1.data.eventUserDatas[0]["_image"]),
      id: hexToString(result1.data.eventUserDatas[0]["id"]),
    });

    console.log(result1.data.eventUserDatas[0]); */
  };

  console.log(profileData);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="profile-main-div">
      <div className="profile-hero-section">
        <div className="profile-form-main">
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

                      <div className="button-flex">
                        <div>
                          <button className="profile-btn">EDIT PICTURE</button>
                          <input
                            className="input-edit-profile"
                            type="file"
                            hidden
                            // defaultValue={nameOfUser}
                          />
                        </div>
                        <div>
                          <button className="profile-btn">Save</button>
                        </div>
                      </div>
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
      <span className="shape1 header-shape">
        <img src={feature1}></img>
      </span>

      <span className="bubble3 header-shape">
        <img src={bubble4}></img>
      </span>
      <span className="bubble4 header-shape">
        <img src={bubble4}></img>
      </span>
    </div>
  );
}

export default Profile;
