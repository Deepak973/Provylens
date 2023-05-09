import React, { useEffect, useRef, useState } from "react";
import "../../styles/deleteproduct.css";
// import productData from "././ViewProduct.json";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import "../../styles/viewproduct.css";
import { createClient } from "urql";
import hexToString from "../../helper/HexToStringConverter";
import { useAccount, useSigner } from "wagmi";
import { MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC } from "../../config";
import manufacturerProduct from "../../artifacts/contracts/manufacturerProduct.sol/manufacturerProduct.json";
import { getContract } from "@wagmi/core";
import { getProvider } from "@wagmi/core";
import { getAllProductsOfManufacturer } from "../../helper/GetMpDetails";
import { QRCodeCanvas } from "qrcode.react";
import img from "../../assets/ProvyLensLogo.png";
import QRCode from "qrcode.react";
// X:\Tron s4\Provylens\src\assets\ProvyLens logo.png

// ................
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ethers } from "ethers";

// ..............
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1a1156",
    color: theme.palette.common.white,
    textAlign: "center",
    letterSpacing: "2px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
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

function ViewProduct() {
  const { address, isConnected } = useAccount();
  const [productData, setProductData] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);

  const canvasRef = useRef(null);

  const toggleModal = () => {
    setModal(!modal);
  };

  //--------------------------------------------------qrcode generation
  const qrcode = (v) => {
    return (
      <QRCodeCanvas
        style={{
          borderWidth: "10px",
          borderStyle: "solid",
          borderColor: "white",
          width: "7rem",
          height: "7rem",
        }}
        ref={canvasRef}
        id={`${v}`}
        value={`https://provylens-virid.vercel.app/verify-product/${v}`}
        imageSettings={{
          src: img,
          // borderWidth: 20,
          // borderColor: "white",
          x: undefined,
          y: undefined,
          height: 70,
          width: 70,
          excavate: true,
        }}
        size={400}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"H"}
      />
    );
  };

  //working one
  const saveImageToLocal = (e) => {
    const a = document.createElement("a");
    const originalCanvas = document.getElementById(e);
    const tempCanvas = document.createElement("canvas");
    const textPadding = 20;
    const textSize = 36;
    const textLine1 = "✔ ProvyLens";
    const textLine2 = "Product Id: " + e;
    const textWidth = originalCanvas.width;
    const textHeight = textSize + textPadding;
    const smallTextSize = 20;
    const smallTextPadding = 10;
    tempCanvas.width = originalCanvas.width + 40;
    tempCanvas.height = originalCanvas.height + textHeight + smallTextSize + 60;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(originalCanvas, 20, 20);
    tempCtx.strokeStyle = "white";
    tempCtx.lineWidth = 20;
    tempCtx.strokeRect(10, 10, tempCanvas.width - 20, tempCanvas.height - 20);
    tempCtx.fillStyle = "black";
    tempCtx.font = `bold ${textSize}px Arial`;
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillText(
      textLine1,
      tempCanvas.width / 2,
      tempCanvas.height -
        textPadding -
        textSize / 2 -
        smallTextSize -
        smallTextPadding
    );
    tempCtx.font = `bold ${smallTextSize}px Arial`;
    tempCtx.fillText(
      textLine2,
      tempCanvas.width / 2,
      tempCanvas.height - smallTextPadding - smallTextSize / 2
    );
    const image = tempCanvas.toDataURL("image/png");
    a.download = "QR-Start";
    a.href = image;
    a.click();
  };

  //---------------------------contract instance
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const connectedContract = getContract({
    address: MANUFACTURERPRODUCT_CONTRACT_ADDRESS_BTTC,
    abi: manufacturerProduct.abi,
    signerOrProvider: signer,
  });

  const getData = async () => {
    setLoading(true);
    const allProductsData = await getAllProductsOfManufacturer(address);
    console.log(allProductsData);
    console.log(parseInt(allProductsData[1][0]["_hex"]));

    const filteredData = allProductsData[0]
      .map((product, index) => {
        if (product["mp_status"]) {
          return {
            mpId: parseInt(allProductsData[1][index]["_hex"]),
            name: hexToString(product["mp_name"]).replace(/\0/g, ""),
            unit: parseInt(product["mp_unit"]),
            price: parseInt(product["mp_price"]),
            dispatchTime:
              product["dispatchTime"] != 0
                ? new Date(product["dispatchTime"] * 1000).toDateString()
                : "Not dispatched yet",
            arrivalTime: parseInt(product["arrivalTime"]),
            date: new Date(product["mp_date"] * 1000).toDateString(),
            expiryDate: new Date(
              product["mp_expiryDate"] * 1000
            ).toDateString(),
            description: hexToString(product["mp_description"]).replace(
              /\0/g,
              ""
            ),
            distributorAddress: product["distributorAddress"],
            smId: Array.isArray(product["smId"])
              ? product["smId"].map((id) => parseInt(id, 16))
              : [parseInt(product["smId"], 16)],
            supplierAddress: Array.isArray(product["supplierAddress"])
              ? product["supplierAddress"]
              : [product["supplierAddress"]],
          };
        } else {
          return null;
        }
      })
      .filter((product) => product !== null);
    console.log(filteredData);
    setProductData(filteredData);
    setTimeout(() => setLoading(false), 1000);
    // setLoading(false);
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
          <Table sx={{ minWidth: 300 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  QR-code
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Product Id
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Product Name
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Unit
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Price per unit
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "" }}>
                  Manufactured date
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Expiry Date
                </StyledTableCell>

                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Distributor address
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Dispatch time
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  spId
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  Supplier Addresses
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  description
                </StyledTableCell>
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
                {productData &&
                  productData.map((product) => (
                    <StyledTableRow key={product.mpId}>
                      <StyledTableCell align="center">
                        {qrcode(product.mpId)}
                        <button
                          id="download_image_link"
                          className="browse-btn"
                          href="download_link"
                          onClick={() => {
                            saveImageToLocal(product.mpId);
                          }}
                        >
                          Download QR Code
                        </button>
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {product.mpId}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {product.name}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {product.unit}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {product.price}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {product.date}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {product.expiryDate}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product.distributorAddress}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product.dispatchTime}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product.smId.join(", ")}{" "}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {product.supplierAddress.join(", ")}{" "}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="view-more-btn">
                          <Button
                            variant="contained"
                            size="large"
                            className="view-More"
                            onClick={() => {
                              setSelectedProduct(product);
                              toggleModal();
                            }}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            View More
                          </Button>
                        </div>
                      </StyledTableCell>
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

export default ViewProduct;
