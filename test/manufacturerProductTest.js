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

describe("manufacturerProductTest", function () {
  let userDetailsInstance;
  let supplierProductInstance;
  let supplierManufacturerInstance;
  let manufacturerProductInstance;
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

    // Manufacturer Product
    const manufacturerProduct = await ethers.getContractFactory(
      "manufacturerProduct"
    );
    manufacturerProductInstance = await manufacturerProduct.deploy(
      userDetailsInstance.address,
      supplierManufacturerInstance.address
    );
    await manufacturerProductInstance.deployed();

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
  });

  it("should add a manufacturer Product", async function () {
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

    expect(mProductDetails[0].mp_name).to.equal(
      byteArrayToHexString(manufacturerProduct.name)
    );
    expect(mProductIds.map((id) => id.toString()).length).to.equal(1);
    expect(mProductDetails[0].mp_status).to.equal(true);
  });

  it("should delete a manufacturer Product", async function () {
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

    await signerManufacturerM.deleteManufacturerProduct(1);

    const [mProductDetails, mProductIds] =
      await signerManufacturerM.getAllProductsOfManufacturer(
        manufacturerAddress
      );

    expect(mProductDetails[0].mp_name).to.equal(
      byteArrayToHexString(manufacturerProduct.name)
    );
    expect(mProductDetails[0].mp_status).to.equal(false);
    expect(mProductIds.map((id) => id.toString()).length).to.equal(1);
  });

  it("should not allow any other entity to addManufacturerProduct except maufacturer", async function () {
    expect(
      manufacturerProductInstance.addManufacturerProduct(
        [supplierAddress],
        [1],
        manufacturerProduct.name,
        manufacturerProduct.desc,
        manufacturerProduct.unit,
        manufacturerProduct.price,
        manufacturerProduct.date,
        manufacturerProduct.expiryDate
      )
    ).to.be.revertedWith("Only Manufacturer can add product");
  });
  it("should not allow any other entity to deleteManufacturerProduct except owner of the product", async function () {
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
    expect(
      manufacturerProductInstance.deleteManufacturerProduct(1)
    ).to.be.revertedWith("Product not owned by you");
  });
});
