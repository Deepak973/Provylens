import React, { useEffect, useRef, useState } from "react";
import "../styles/deleteproduct.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import feature1 from "../assets/feature-1.png";
import bubble4 from "../assets/fixed4.png";
import feature2 from "../assets/header6_shape_5.png";
import "../styles/viewproduct.css";
import { createClient } from "urql";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import hexToString from "../helper/HexToStringConverter";
import Footer from "../components/Footer";
// ...graph..........
import { ForceGraph2D } from "react-force-graph";
import { details } from "./verifyDetails";
import { QRCodeCanvas } from "qrcode.react";
import img from "../assets/ProvyLensLogo.png";
import { getProductsOfManufacturer } from "../helper/GetMpDetails";

function VerifyProduct() {
  const [age, setAge] = useState("");
  // const [productId, setProductId] = useState();
  const [supplierDetails, setSupplierDetails] = useState();
  const [manufacturerDetails, setManufacturerDetails] = useState();
  const [supplierProduct, setSupplierProduct] = useState();

  const [isClicked, setIsClicked] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [productData, setProductData] = useState({});

  const [productId, setProductId] = useState(false);

  const canvasRef = useRef(null);

  const downloadQRCode = (e) => {
    e.preventDefault();
    setProductId("");
  };
  const qrCodeEncoder = (e) => {
    setProductId(e.target.value);
  };

  // const qrcode = (
  //   <QRCodeCanvas
  //     style={{
  //       borderWidth: "10px",
  //       borderStyle: "solid",
  //       borderColor: "white",
  //       width: "7rem",
  //       height: "7rem",
  //     }}
  //     ref={canvasRef}
  //     id={productId}
  //     value={productId}
  //     bgColor={"#ffffff"}
  //     fgColor={"#000000"}
  //     level={"H"}
  //     imageSettings={{
  //       src: img,
  //       // borderWidth: 200,
  //       // borderColor: "white",
  //       x: undefined,
  //       y: undefined,
  //       height: 70,
  //       width: 70,
  //       excavate: true,
  //     }}
  //     size={400}
  //   />
  //     <QRCodeCanvas
  //   value={"https://picturesofpeoplescanningqrcodes.tumblr.com/"}
  //   size={128}
  //   bgColor={"#ffffff"}
  //   fgColor={"#000000"}
  //   level={"H"}
  //   includeMargin={false}
  //   imageSettings={{
  //     src: "https://static.zpao.com/favicon.png",
  //     x: undefined,
  //     y: undefined,
  //     height: 24,
  //     width: 24,
  //     excavate: true,
  //   }}
  // />
  // );

  // const saveImageToLocal = () => {
  //   const a = document.createElement("a");
  //   const originalCanvas = document.getElementById(productId);
  //   const tempCanvas = document.createElement("canvas");
  //   const textPadding = 20;
  //   const textSize = 36;
  //   const textLine1 = "✔ ProvyLens";
  //   const textLine2 = "Product Id: " + productId;
  //   const textWidth = originalCanvas.width;
  //   const textHeight = textSize + textPadding;
  //   const smallTextSize = 20;
  //   const smallTextPadding = 10;
  //   tempCanvas.width = originalCanvas.width + 40;
  //   tempCanvas.height = originalCanvas.height + textHeight + smallTextSize + 60;
  //   const tempCtx = tempCanvas.getContext("2d");
  //   tempCtx.fillStyle = "white";
  //   tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  //   tempCtx.drawImage(originalCanvas, 20, 20);
  //   tempCtx.strokeStyle = "white";
  //   tempCtx.lineWidth = 20;
  //   tempCtx.strokeRect(10, 10, tempCanvas.width - 20, tempCanvas.height - 20);
  //   tempCtx.fillStyle = "black";
  //   tempCtx.font = `bold ${textSize}px Arial`;
  //   tempCtx.textAlign = "center";
  //   tempCtx.textBaseline = "middle";
  //   tempCtx.fillText(
  //     textLine1,
  //     tempCanvas.width / 2,
  //     tempCanvas.height -
  //       textPadding -
  //       textSize / 2 -
  //       smallTextSize -
  //       smallTextPadding
  //   );
  //   tempCtx.font = `bold ${smallTextSize}px Arial`;
  //   tempCtx.fillText(
  //     textLine2,
  //     tempCanvas.width / 2,
  //     tempCanvas.height - smallTextPadding - smallTextSize / 2
  //   );
  //   const image = tempCanvas.toDataURL("image/png");
  //   a.download = "QR-Start";
  //   a.href = image;
  //   a.click();
  // };

  // const textLine2 = `Product Id: ${productId} ` + productId;

  const data01 = {
    nodes: [
      {
        id: "0",
        name: "Product",
        value: 6,
      },
      {
        id: "1",
        label: "",
        name: "Distributor",
        value: 4,
      },
      {
        id: "2",
        label: "",
        name: "manufacturer",
        value: 4,
      },
      {
        id: "3",
        name: "Supplier",
        value: 4,
      },
      {
        id: "4",
        name: "manufacturer 1",
        value: 4,
      },
      {
        id: "5",
        name: "manufacturer 1",
        value: 4,
      },
      {
        id: "6",
        name: "manufacturer 1",
        value: 4,
      },
    ],
    links: [
      { source: "0", target: "1" },
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "2", target: "4" },
      { source: "2", target: "5" },
      { source: "2", target: "6" },
    ],
  };
  const nodes = data01.nodes?.map((node) => ({
    id: node.id,
    name: node.name,
    value: node.value,
  }));
  const links = data01.links?.map((link) => ({
    source: link.source,
    target: link.target,
  }));

  const toggleModal = () => {
    setModal(!modal);
    setIsOpen(!isOpen);
    console.log(details[0].Name);
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  // ............Node Functionality.......
  const fgRef = useRef();

  useEffect(() => {
    const fg = fgRef.current;
    // Deactivate existing forces
    fg.d3Force("link").distance((link) => 40);
    fg.d3Force("charge").strength(-200); // the default is -30
  }, []);

  function nodePaint(
    { id, x, y, name, value, code, imgSrc },
    ctx,
    globalScale
  ) {
    const fontSize = (10 / globalScale) * 2;
    ctx.font = `${fontSize}px Bai Jamjuree`;
    const textWidth = ctx.measureText(name).width;
    ctx.fillStyle = "#181816"; // sets node color randomly based on ID

    let img = new Image();
    if (imgSrc) {
      img.src = imgSrc;
    }

    const imgR = (10 / globalScale) * 3;

    return (() => {
      ctx.beginPath();

      // circle
      ctx.arc(x, y, value * 3, 0, 3 * Math.PI, false);
      ctx.shadowColor = code ?? "#FFFFFF";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // text
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(name, x - textWidth / 2 + imgR, y);

      if (imgSrc) {
        // logo
        ctx.drawImage(
          img,
          x - imgR / 2 - textWidth / 2,
          y - imgR / 2,
          imgR,
          imgR
        );
      }
    })();
  }

  const handleClick = (node) => {
    fgRef.current.centerAt(
      node.x + 20,
      node.y,
      500 // ms transition duration
    );
    fgRef.current.zoom(8, 500);
    setIsClicked(true);
  };

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const [isHover, setHover] = useState(false);
  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  function handleSubmit(e) {
    e.preventDefault();
    fgRef.current.centerAt(
      60,
      65,
      500 // ms transition duration
    );
    fgRef.current.zoom(8, 500);
    setIsClicked2(true);
  }

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    setHover(!isHover);

    updateHighlight();
  };

  const changeModal = (e) => {
    if (e.id === "0") {
      setProductData(details[0]);
      setModal(!modal);
    } else if ("1") {
      setProductData(details[1]);
      setModal(!modal);
    } else if ("2") {
      setProductData(details[2]);
      setModal(!modal);
    } else if ("3") {
      setProductData(details[3]);
      setModal(!modal);
    }
  };

  const ModalData = () => {
    return (
      <div className=" modal ">
        <div onClick={toggleModal}></div>
        <div className={` modal-content-verify ${isOpen ? "open" : ""}`}>
          <h1 className="product-details-title">Product Details</h1>
          <div className="verify-modal-details">
            <label className="product-name">name:{productData.Name}</label>
            <label className="product-name">Price:{productData.Price}</label>
            <label className="product-name">
              Produced Date:{productData.PDate}
            </label>
            <label className="product-name">
              Expiry Date:{productData.EDate}
            </label>
            <label className="product-name">
              Physical Address:{productData.physicalAddress}
            </label>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  };
  // ................

  const getProductDetails = async (smId) => {
    console.log(smId);
    const allData = await getProductsOfManufacturer(smId);
    console.log(allData);
    const filterData = {
      //manufactureProduct details
      manufacturedProductName: hexToString(allData[0]["mp_name"]),
      manufacturedProductDesription: hexToString(allData[0]["mp_description"]),
      manufacturedProductPrice: parseInt(allData[0]["mp_price"]),
      manufacturedProductManufactureDate: new Date(
        allData[0]["mp_date"]
      ).toDateString(),
      manufacturedProductExpiryDate: new Date(
        allData[0]["mp_expiryDate"]
      ).toDateString(),
      manufacturedProductDispatchDate: new Date(
        allData[0]["dispatchTime"]
      ).toDateString(),
      //manufacture details
      manufactureName: hexToString(allData[2]["userName"]),
      manufacturerAddress: hexToString(allData[2]["userPhysicalAddress"]),
      manufactureLogo: hexToString(allData[2]["userImage"]),
      //distributor details
      distributorName: hexToString(allData[3]["userName"]),
      distributorAddress: hexToString(allData[3]["userPhysicalAddress"]),
      distributorLogo: hexToString(allData[3]["userImage"]),
    };
    console.log(filterData);

    const filteredDataOfSupplier = allData[1].map((val, index) => {
      return {
        reqId: parseInt(val[0]["smId"]),
        spId: parseInt(val[0]["spId"]),
        // name: hexToString(val["userName"]),
        status:
          val[0]["status"] === 1
            ? "Requested"
            : val[0]["status"] === 2
            ? "Approved"
            : val[0]["status"] === 3
            ? "Received"
            : null,
        manufacturerAddress: val[0]["manufacturerAddress"],
        quantity: val[0]["quantity"],
        productname: hexToString(val[1]["sp_name"]),
        p_description: hexToString(val[1]["sp_description"]),
        p_expiry_date: new Date(val[1]["sp_expiryDate"]).toDateString(),
        p_date_created: new Date(val[1]["sp_date"]).toDateString(),
        manufacturer_name: hexToString(val[2]["userName"]),
      };
    });
    console.log(filteredDataOfSupplier);

    // const filteredData = allData.map((val, index) => {
    //   return {
    //     //manufactured product details
    //     manufacturedProductName: val["mp_name"],
    //     // spId: parseInt(val[0]["spId"]),
    //     // // name: hexToString(val["userName"]),
    //     // status:
    //     //   val[0]["status"] === 1
    //     //     ? "Requested"
    //     //     : val[0]["status"] === 2
    //     //     ? "Approved"
    //     //     : val[0]["status"] === 3
    //     //     ? "Received"
    //     //     : null,
    //     // manufacturerAddress: val[0]["manufacturerAddress"],
    //     // quantity: val[0]["quantity"],
    //     // productname: hexToString(val[1]["sp_name"]),
    //     // p_description: hexToString(val[1]["sp_description"]),
    //     // p_expiry_date: new Date(val[1]["sp_expiryDate"]).toDateString(),
    //     // p_date_created: new Date(val[1]["sp_date"]).toDateString(),
    //     // manufacturer_name: hexToString(val[2]["userName"]),
    //   };
    // });

    // console.log(filteredData);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const toastInfo = () =>
    toast.success("Product Deleted", {
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
      <div className="verify-product-main-div">
        <div className="delete-product-main-div">
          <TextField
            helperText=" "
            id="demo-helper-text-aligned-no-helper"
            label="Product Id"
            sx={{
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "..MuiOutlinedInput-input.Mui-focused": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },

              ".MuiInputLabel-root ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiInputLabel-root.Mui-focused ": {
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "HammersmithOne-Regular",
              },
              ".MuiOutlinedInput-input": {
                color: "white",
                fontFamily: "HammersmithOne-Regular",
              },
            }}
            onChange={(e) => {
              setProductId(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              getProductDetails(productId);
            }}
            variant="contained"
            size="large"
            className="verify-btn"
          >
            Verify Product
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
        <div>
          {modal && <ModalData />}
          <ForceGraph2D
            ref={fgRef}
            graphData={{ nodes, links }}
            nodeLabel="name"
            nodeAutoColorBy="group"
            autoPauseRedraw={false}
            linkWidth={(link) => (highlightLinks.has(link) ? 10 : 1)}
            linkDirectionalParticles={0}
            linkDirectionalParticleWidth={(link) =>
              highlightLinks.has(link) ? 4 : 0
            }
            onBackgroundClick={() => fgRef.current.zoomToFit(1000, 100)}
            linkCurvature="curvature"
            linkColor={() => "rgba(255,255,255,255)"}
            nodeCanvasObject={(node, ctx, globalScale) =>
              nodePaint(node, ctx, globalScale)
            }
            nodeVal={(node) => node.value}
            onNodeDragEnd={(node) => {
              node.fx = node.x;
              node.fy = node.y;
            }}
            onNodeClick={(e) => {
              changeModal(e);
            }}
            cooldownTicks={20}
            // onLinkHover={handleLinkHover}
          />
        </div>
        <span className="shape1 header-shape">
          <img src={feature1} className="verify-product-img"></img>
        </span>
        <span className="bubble3 header-shape">
          <img src={bubble4}></img>
        </span>
        <span className="bubble4 header-shape">
          <img src={bubble4}></img>
        </span>
        <Footer />
      </div>
    </>
  );
}

export default VerifyProduct;
