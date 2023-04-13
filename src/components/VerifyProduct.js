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

  const qrcode = (
    <QRCodeCanvas
      style={{
        marginLeft: "100px",
        borderWidth: "10px",
        borderStyle: "solid",
        borderColor: "white",
      }}
      ref={canvasRef}
      id="qrCode"
      value={productId}
      size={300}
      bgColor={"#fff"}
      level={"H"}
    />
  );

  /* const saveImageToLocal = () => {
    // let link = event.currentTarget;
    const a = document.createElement("a");
    // document.body.appendChild(a);
    console.log(a);
    const canvas = document.getElementById("qrCode");
    var image = canvas.toDataURL("image/png");
    a.download = "QR-Start";
    a.href = image;
    a.click();
  }; */

  /* const saveImageToLocal = () => {
    const a = document.createElement("a");
    const originalCanvas = document.getElementById("qrCode");
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalCanvas.width + 40; // add 40px to width for border
    tempCanvas.height = originalCanvas.height + 40; // add 40px to height for border
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.strokeStyle = "white";
    tempCtx.lineWidth = 30;
    tempCtx.strokeRect(
      30, // add 20px to x-coordinate for left border
      30, // add 20px to y-coordinate for top border
      originalCanvas.width, // use original width for QR code
      originalCanvas.height // use original height for QR code
    );
    tempCtx.drawImage(originalCanvas, 30, 30); // draw original QR code onto temp canvas with 20px offset
    const image = tempCanvas.toDataURL("image/png");
    a.download = "QR-Start";
    a.href = image;
    a.click();
  }; */

  /* const saveImageToLocal = () => {
    const a = document.createElement("a");
    const originalCanvas = document.getElementById("qrCode");
    const tempCanvas = document.createElement("canvas");
    const textPadding = 20;
    const textSize = 36;
    const text = "✔ ProvyLens";
    const textWidth = originalCanvas.width;
    const textHeight = textSize + textPadding;
    tempCanvas.width = originalCanvas.width + 40;
    tempCanvas.height = originalCanvas.height + textHeight + 40;
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
      text,
      tempCanvas.width / 2,
      tempCanvas.height - textPadding - textSize / 2
    );
    const image = tempCanvas.toDataURL("image/png");
    a.download = "QR-Start";
    a.href = image;
    a.click();
  }; */

  const saveImageToLocal = () => {
    const a = document.createElement("a");
    const originalCanvas = document.getElementById("qrCode");
    const tempCanvas = document.createElement("canvas");
    const textPadding = 20;
    const textSize = 36;
    const textLine1 = "✔ ProvyLens";
    const textLine2 = "Product Id: " + productId;
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

  const getSmId = async (productId) => {
    const data_ = `query MyQuery {
      eventSupplierManufacturerTransfers(where: {_smId: "${productId}"}) {
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

    setProductId({
      dispatchTime: new Date(
        result1.data.eventSupplierManufacturerTransfers[0]["_name"] * 1000
      ).toDateString(),
      manufacturerAddress:
        result1.data.eventSupplierManufacturerTransfers[0][
          "_manufacturerAddress"
        ],
      productId: result1.data.eventSupplierManufacturerTransfers[0]["_smId"],
      spId: result1.data.eventSupplierManufacturerTransfers[0]["_spId"],
      supplierAddress:
        result1.data.eventSupplierManufacturerTransfers[0]["_supplierAddress"],
    });
    console.log(result1.data.eventSupplierManufacturerTransfers[0]);

    await getSupplier(
      result1.data.eventSupplierManufacturerTransfers[0]["_supplierAddress"]
    );

    await getManufacturer(
      result1.data.eventSupplierManufacturerTransfers[0]["_manufacturerAddress"]
    );

    await getProductDetails(
      result1.data.eventSupplierManufacturerTransfers[0]["_spId"]
    );
  };

  const getSupplier = async (supplierAddress) => {
    const data_ = `query MyQuery {
      eventUserDatas(where: {_address: "${supplierAddress.toLowerCase()}"}) {
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

    setSupplierDetails({
      name: hexToString(result1.data.eventUserDatas[0]["_name"]).slice(1),
      type: role,
      phy_add: hexToString(
        result1.data.eventUserDatas[0]["_physicalAddress"]
      ).slice(1),
      image: hexToString(result1.data.eventUserDatas[0]["_image"]),
      id: hexToString(result1.data.eventUserDatas[0]["id"]),
    });

    console.log(result1.data.eventUserDatas[0]);
  };

  const getManufacturer = async (manufacturerAddress) => {
    const data_ = `query MyQuery {
      eventUserDatas(where: {_address: "${manufacturerAddress.toLowerCase()}"}) {
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

    setManufacturerDetails({
      name: hexToString(result1.data.eventUserDatas[0]["_name"]).slice(1),
      type: role,
      phy_add: hexToString(
        result1.data.eventUserDatas[0]["_physicalAddress"]
      ).slice(1),
      image: hexToString(result1.data.eventUserDatas[0]["_image"]),
      id: hexToString(result1.data.eventUserDatas[0]["id"]),
    });

    console.log(result1.data.eventUserDatas[0]);
  };

  const getProductDetails = async (spId) => {
    const data_ = `query MyQuery {
      eventAddSupplierProducts(where: {_spid: "${spId}"}) {
        _address
        _date
        _description
        _expiryDate
        _name
        _price
        _spid
        _timeAdded
        _unit
      }
    }`;

    const c = createClient({
      url: "https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1",
    });

    const result1 = await c.query(data_).toPromise();

    setSupplierProduct({
      spId: result1.data.eventAddSupplierProducts[0]["_spid"],
      name: hexToString(
        result1.data.eventAddSupplierProducts[0]["_name"]
      ).slice(1),
      unit: result1.data.eventAddSupplierProducts[0]["_unit"],
      price: result1.data.eventAddSupplierProducts[0]["_price"],
      date: new Date(
        result1.data.eventAddSupplierProducts[0]["_date"] * 1000
      ).toDateString(),
      expiryDate: new Date(
        result1.data.eventAddSupplierProducts[0]["_expiryDate"] * 1000
      ).toDateString(),
      description: hexToString(
        result1.data.eventAddSupplierProducts[0]["_description"]
      ),
    });

    // setSupplierProduct({
    //   ...supplierProduct,
    //   supplierDetails: supplierDetails,
    //   manufacturerDetails: manufacturerDetails,
    // });

    console.log(result1.data.eventAddSupplierProducts[0]);
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
        <div>{qrcode}</div>
        {/* <div><form onSubmit={downloadQRCode}></form></div> */}
        <button
          id="download_image_link"
          className="browse-btn"
          href="download_link"
          onClick={() => {
            saveImageToLocal();
          }}
        >
          Download QR Code
        </button>
        <div className="delete-product-main-div">
          <TextField
            helperText=" "
            id="demo-helper-text-aligned-no-helper"
            label="Product Id"
            onChange={(e) => {
              setProductId(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              getSmId(productId);
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
            linkDirectionalParticles={3}
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
            onLinkHover={handleLinkHover}
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
