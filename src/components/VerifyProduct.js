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
import { useParams } from "react-router-dom";

function VerifyProduct() {
  const { id } = useParams();
  const [age, setAge] = useState("");
  const [smId, setSmId] = useState();
  const [supplierDetails, setSupplierDetails] = useState();
  const [manufacturerDetails, setManufacturerDetails] = useState();
  const [supplierProduct, setSupplierProduct] = useState();

  const [isClicked, setIsClicked] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [productData, setProductData] = useState({});

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
              <h1>Value from URL: {id}</h1>
            </button>
          </div>
        </div>
      </div>
    );
  };
  // ................

  const getSmId = async (smId) => {
    const data_ = `query MyQuery {
      eventSupplierManufacturerTransfers(where: {_smId: "${smId}"}) {
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

    setSmId({
      dispatchTime: new Date(
        result1.data.eventSupplierManufacturerTransfers[0]["_name"] * 1000
      ).toDateString(),
      manufacturerAddress:
        result1.data.eventSupplierManufacturerTransfers[0][
          "_manufacturerAddress"
        ],
      smId: result1.data.eventSupplierManufacturerTransfers[0]["_smId"],
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
        <div className="delete-product-main-div">
          <TextField
            helperText=" "
            id="demo-helper-text-aligned-no-helper"
            label="Product Id"
            onChange={(e) => {
              setSmId(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              getSmId(smId);
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
