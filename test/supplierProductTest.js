const {
  supplierProduct,
  manufacturerProduct,
  distributorProduct,
} = require("../src/DummyData/productData");
const {
  supplierData,
  manufacturerData,
  distributorData,
} = require("../src/DummyData/userDetailsData");
const { ethers } = require("hardhat");
const { expect } = require("chai");
const encoder = new TextEncoder();

describe("supplierProduct", function () {
  let userDetailsInstance;
  let supplierProductInstance;
  let supplierAddress;
  let manufacturerAddress;
  let distributorAddress;

  // signer variables with contract instance
  let signerSupplier;
  let signerSupplierP;
  let signerManufacturer;
  let signerManufacturerP;
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
    const UserDetails = await ethers.getContractFactory("userDetails");
    userDetailsInstance = await UserDetails.deploy();
    await userDetailsInstance.deployed();

    const SupplierProduct = await ethers.getContractFactory("supplierProduct");
    supplierProductInstance = await SupplierProduct.deploy(
      userDetailsInstance.address
    );
    await supplierProductInstance.deployed();

    // console.log("userDetails:" + userDetailsInstance.address);
    // console.log("supp:" + supplierProductInstance.address);

    // getting all signers (supplier / manufacturer /distributor)
    const signers = await ethers.getSigners();

    supplierAddress = signers[1].address;
    manufacturerAddress = signers[2].address;
    distributorAddress = signers[3].address;

    signerSupplier = await userDetailsInstance.connect(
      ethers.provider.getSigner(supplierAddress)
    );
    signerManufacturer = await userDetailsInstance.connect(
      ethers.provider.getSigner(manufacturerAddress)
    );
    signerDistributor = await userDetailsInstance.connect(
      ethers.provider.getSigner(distributorAddress)
    );

    signerSupplierP = await supplierProductInstance.connect(
      ethers.provider.getSigner(supplierAddress)
    );
    signerManufacturerP = await supplierProductInstance.connect(
      ethers.provider.getSigner(manufacturerAddress)
    );
    // signerDistributor = await userDetailsInstance.connect(
    //   ethers.provider.getSigner(distributorAddress)
    // );
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
  });

  // it("should be equal", async function () {
  //   expect(3).to.equal(3);
  // });

  it("should add a supplier product", async function () {
    await signerSupplierP.addSupplierProduct(
      supplierProduct.name,
      supplierProduct.desc,
      supplierProduct.unit,
      supplierProduct.price,
      supplierProduct.date,
      supplierProduct.expiryDate
    );
    await signerSupplierP.addSupplierProduct(
      supplierProduct.name,
      supplierProduct.desc,
      supplierProduct.unit,
      supplierProduct.price,
      supplierProduct.date,
      supplierProduct.expiryDate
    );

    const onlyProductIds = await signerSupplierP.getSupplierProductIds(); // testing view function ( getSupplierProductIds )

    const productIdsByAddress = await signerSupplierP.getSpIdsByAddress(
      // testing view function ( getSpIdsByAddress )
      supplierAddress
    );

    const product = await signerSupplierP.getSingleSupplierProduct(
      // testing view function ( getSingleSupplierProduct )
      onlyProductIds[0]
    );

    const [productDetails, productIds] =
      await signerSupplierP.getAllActiveProductsOfSupplier(supplierAddress);

    expect(productIds.map((id) => id.toString()).length).to.equal(2);
    expect(onlyProductIds.map((id) => id.toString()).length).to.equal(2);
    expect(productIdsByAddress.map((id) => id.toString()).length).to.equal(2);
    expect(product.sp_name).to.equal(
      byteArrayToHexString(supplierProduct.name)
    );
    expect(productDetails[0].sp_name).to.equal(
      byteArrayToHexString(supplierProduct.name)
    );
    expect(product.sp_description).to.equal(
      byteArrayToHexString(supplierProduct.desc)
    );
    expect(product.sp_unit).to.equal(supplierProduct.unit);
    expect(product.sp_price).to.equal(supplierProduct.price);
    expect(product.sp_date).to.equal(supplierProduct.date);
    expect(product.sp_expiryDate).to.equal(supplierProduct.expiryDate);
    expect(product.sp_status).to.equal(true);
  });

  it("should delete supplier product", async function () {
    await signerSupplierP.addSupplierProduct(
      supplierProduct.name,
      supplierProduct.desc,
      supplierProduct.unit,
      supplierProduct.price,
      supplierProduct.date,
      supplierProduct.expiryDate
    );
    await signerSupplierP.addSupplierProduct(
      supplierProduct.name,
      supplierProduct.desc,
      supplierProduct.unit,
      supplierProduct.price,
      supplierProduct.date,
      supplierProduct.expiryDate
    );

    await signerSupplierP.deleteSupplierProduct(1);

    const [productDetails, productIds] =
      await signerSupplierP.getAllProductsOfSupplier(supplierAddress);
    const [productDetailsActive, productIdsActive] =
      await signerSupplierP.getAllActiveProductsOfSupplier(supplierAddress);

    expect(productDetails[0].sp_status).to.equal(false);
    expect(productIds.map((id) => id.toString()).length).to.equal(2);
    expect(productIdsActive.map((id) => id.toString()).length).to.equal(1);
  });

  it("should not allow deleting product not owned by the address", async function () {
    await signerSupplierP.addSupplierProduct(
      supplierProduct.name,
      supplierProduct.desc,
      supplierProduct.unit,
      supplierProduct.price,
      supplierProduct.date,
      supplierProduct.expiryDate
    );

    // Here signerManufacturerP is another address
    expect(signerManufacturerP.deleteSupplierProduct(1)).to.be.revertedWith(
      "Product not owned by you"
    );
  });

  it("should not allow any other entity to addsupplier product except supplier", async function () {
    expect(
      signerManufacturerP.addSupplierProduct(
        supplierProduct.name,
        supplierProduct.desc,
        supplierProduct.unit,
        supplierProduct.price,
        supplierProduct.date,
        supplierProduct.expiryDate
      )
    ).to.be.revertedWith("Only Supplier can add products");
  });
});
