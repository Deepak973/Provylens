import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import feature1 from "../assets/feature-1.png";
import bubble4 from "../assets/fixed4.png";
import { createClient } from "urql";
import { useAccount, useSigner } from "wagmi";
import hexToString from "./HexToStringConverter";

function Profile() {
  const { address, isConnected } = useAccount();
  const [profileData, setProfileData] = useState();

  const getData = async () => {
    const data_ = `query MyQuery {
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

    console.log(result1.data.eventUserDatas[0]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="profile-main-div">
      <div className="profile-hero-section">
        <div className="profile-form-main">
          {profileData ? (
            <>
              <div className="user-profile-div">
                <img src={profileData.image} alt="" className="profile-img" />
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
            ""
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
