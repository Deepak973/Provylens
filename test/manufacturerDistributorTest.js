const {
  supplierProduct,
  manufacturerProduct,
} = require("../src/DummyData/productData");
const {
  supplierData,
  manufacturerData,
  distributorData,
} = require("../src/DummyData/userDetailsData");
const { ethers } = require("hardhat");
const { expect } = require("chai");
const encoder = new TextEncoder();

describe("manufacturerDistributorTest", function () {
  let userDetailsInstance;
  let supplierProductInstance;
  let supplierManufacturerInstance;
  let manufacturerProductInstance;
  let manufacturerDistributorInstance;
  let supplierAddress;
  let manufacturerAddress;
  let distributorAddress;

  // signer variables with contract instance
  let signerSupplier;
  let signerSupplierP;
  let signerSupplierT;
  let signerManufacturer;
  let signerManufacturerP;
  let signerManufacturerT;
  let signerManufacturerT2;
  let signerDistributorT2;
  let signerManufacturerM;
  let signerDistributor;

  function byteArrayToHexString(byteArray) {
    const hexString =
      "0x" +
      Array.from(byteArray, (byte) => byte.toString(16).padStart(2, "0")).join(
        ""
      );
    return hexString;
  }

  beforeEach(async function () {
    // userDetails Instance
    const UserDetails = await ethers.getContractFactory("userDetails");
    userDetailsInstance = await UserDetails.deploy();
    await userDetailsInstance.deployed();

    // SupplierProduct Instance
    const SupplierProduct = await ethers.getContractFactory("supplierProduct");
    supplierProductInstance = await SupplierProduct.deploy(
      userDetailsInstance.address
    );
    await supplierProductInstance.deployed();

    // SupplierManufacturer Instance
    const supplierManufacturer = await ethers.getContractFactory(
      "supplierManufacturer"
    );
    supplierManufacturerInstance = await supplierManufacturer.deploy(
      userDetailsInstance.address,
      supplierProductInstance.address
    );
    await supplierManufacturerInstance.deployed();

    // Manufacturer Product Instance
    const manufacturerProduct = await ethers.getContractFactory(
      "manufacturerProduct"
    );
    manufacturerProductInstance = await manufacturerProduct.deploy(
      userDetailsInstance.address,
      supplierManufacturerInstance.address
    );
    await manufacturerProductInstance.deployed();

    // ManufacturerDistributor Instance
    const manufacturerDistributor = await ethers.getContractFactory(
      "manufacturerDistributor"
    );
    manufacturerDistributorInstance = await manufacturerDistributor.deploy(
      userDetailsInstance.address,
      manufacturerProductInstance.address
    );
    await manufacturerDistributorInstance.deployed();

    // Signers
    const signers = await ethers.getSigners();

    supplierAddress = signers[1].address;
    manufacturerAddress = signers[2].address;
    distributorAddress = signers[3].address;

    // userDetails signers
    signerSupplier = await userDetailsInstance.connect(
      ethers.provider.getSigner(supplierAddress)
    );
    signerManufacturer = await userDetailsInstance.connect(
      ethers.provider.getSigner(manufacturerAddress)
    );
    signerDistributor = await userDetailsInstance.connect(
      ethers.provider.getSigner(distributorAddress)
    );

    // supplierProduct signers
    signerSupplierP = await supplierProductInstance.connect(
      ethers.provider.getSigner(supplierAddress)
    );
    signerManufacturerP = await supplierProductInstance.connect(
      ethers.provider.getSigner(manufacturerAddress)
    );

    // supplierManufacturer signers
    signerSupplierT = await supplierManufacturerInstance.connect(
      ethers.provider.getSigner(supplierAddress)
    );
    signerManufacturerT = await supplierManufacturerInstance.connect(
      ethers.provider.getSigner(manufacturerAddress)
    );

    // manufacturerProduct signers
    signerManufacturerM = await manufacturerProductInstance.connect(
      ethers.provider.getSigner(manufacturerAddress)
    );

    // manufacturerDistributor Signers
    signerManufacturerT2 = await manufacturerDistributorInstance.connect(
      ethers.provider.getSigner(manufacturerAddress)
    );
    signerDistributorT2 = await manufacturerDistributorInstance.connect(
      ethers.provider.getSigner(distributorAddress)
    );
  });

  beforeEach(async function () {
    await signerSupplier.addUser(
      supplierData.userType,
      supplierData.name,
      supplierData.physicalAddress,
      supplierData.image
    );
    await signerManufacturer.addUser(
      manufacturerData.userType,
      manufacturerData.name,
      manufacturerData.physicalAddress,
      manufacturerData.image
    );
    await signerDistributor.addUser(
      distributorData.userType,
      distributorData.name,
      distributorData.physicalAddress,
      distributorData.image
    );

    const supplierUser = await signerSupplier.getSingleUser(supplierAddress);
    const manufacturerUser = await signerManufacturer.getSingleUser(
      manufacturerAddress
    );
    const distributorUser = await signerDistributor.getSingleUser(
      distributorAddress
    );

    await signerSupplierP.addSupplierProduct(
      supplierProduct.name,
      supplierProduct.desc,
      supplierProduct.unit,
      supplierProduct.price,
      supplierProduct.date,
      supplierProduct.expiryDate
    );

    const [productDetails, productIds] =
      await signerSupplierP.getAllActiveProductsOfSupplier(supplierAddress);

    await signerManufacturerT.requestProduct(1, 30, supplierAddress);
    await signerSupplierT.transferProduct(1, manufacturerAddress, 30, 30);
    await signerManufacturerT.receiveProduct(1);

    const transfer =
      await signerSupplierT.getAllSmIdForSupplierWithproductDetails(
        supplierAddress
      );

    await signerManufacturerM.addManufacturerProduct(
      [supplierAddress],
      [1],
      manufacturerProduct.name,
      manufacturerProduct.desc,
      manufacturerProduct.unit,
      manufacturerProduct.price,
      manufacturerProduct.date,
      manufacturerProduct.expiryDate
    );

    const [mProductDetails, mProductIds] =
      await signerManufacturerM.getAllProductsOfManufacturer(
        manufacturerAddress
      );

    // Expect for supplier
    expect(supplierUser.userType).to.equal(0);
    expect(supplierUser.userName).to.equal(
      byteArrayToHexString(supplierData.name)
    );
    expect(supplierUser.userPhysicalAddress).to.equal(
      byteArrayToHexString(supplierData.physicalAddress)
    );
    expect(supplierUser.userImage).to.equal(
      byteArrayToHexString(supplierData.image)
    );

    // Expect for manufacturer
    expect(manufacturerUser.userType).to.equal(1);
    expect(manufacturerUser.userName).to.equal(
      byteArrayToHexString(manufacturerData.name)
    );
    expect(manufacturerUser.userPhysicalAddress).to.equal(
      byteArrayToHexString(manufacturerData.physicalAddress)
    );
    expect(manufacturerUser.userImage).to.equal(
      byteArrayToHexString(manufacturerData.image)
    );

    // Expect for distributor
    expect(distributorUser.userType).to.equal(2);
    expect(distributorUser.userName).to.equal(
      byteArrayToHexString(distributorData.name)
    );
    expect(distributorUser.userPhysicalAddress).to.equal(
      byteArrayToHexString(distributorData.physicalAddress)
    );
    expect(distributorUser.userImage).to.equal(
      byteArrayToHexString(distributorData.image)
    );

    expect(productDetails[0].sp_name).to.equal(
      byteArrayToHexString(supplierProduct.name)
    );
    expect(productIds.map((id) => id.toString()).length).to.equal(1);

    // transfer
    expect(transfer[0]["smDetails"]["status"]).to.equal(3);

    // manufacturerProduct

    expect(mProductDetails[0].mp_name).to.equal(
      byteArrayToHexString(manufacturerProduct.name)
    );
    expect(mProductIds.map((id) => id.toString()).length).to.equal(1);
    expect(mProductDetails[0].mp_status).to.equal(true);
  });

  it("should be equal", async function () {
    expect(3).to.equal(3);
  });

  it("should request stock from distributor to manufacturer", async function () {
    await signerDistributorT2.requestProduct(1, 20, manufacturerAddress);
    const requests = await signerManufacturerT2.getAllmdIdForManufacturer(
      manufacturerAddress
    );
    expect(requests[0]["mdDetails"]["status"]).to.equal(1);
  });

  it("should transfer stock from manufacturer to distributor", async function () {
    await signerDistributorT2.requestProduct(1, 20, manufacturerAddress);

    await signerManufacturerT2.transferProduct(1, 1, distributorAddress, 20);
    const transfers = await signerManufacturerT2.getAllmdIdForManufacturer(
      manufacturerAddress
    );

    expect(transfers[0]["mdDetails"]["status"]).to.equal(2);
  });

  it("should acknowledge product received", async function () {
    await signerDistributorT2.requestProduct(1, 20, manufacturerAddress);

    await signerManufacturerT2.transferProduct(1, 1, distributorAddress, 20);

    await signerDistributorT2.receiveProduct(1, 1);
    const transfers = await signerManufacturerT2.getAllmdIdForManufacturer(
      manufacturerAddress
    );

    expect(transfers[0]["mdDetails"]["status"]).to.equal(3);
  });
});
