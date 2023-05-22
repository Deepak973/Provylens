const {
  supplierData,
  manufacturerData,
  distributorData,
} = require("../src/DummyData/userDetailsData");
const { ethers } = require("hardhat");
const { expect } = require("chai");
const encoder = new TextEncoder();

describe("userDetails", function () {
  let userDetailsInstance;
  // let userAddress;
  let supplierAddress;
  let manufacturerAddress;
  let distributorAddress;

  // signer variables with contract instance
  let signerSupplier;
  let signerManufacturer;
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

    // getting all signers (supplier / manufacturer /distributor)
    const signers = await ethers.getSigners();
    // userAddress = signers[0].address;
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
    // console.log(supplierUser);
    const manufacturerUser = await signerManufacturer.getSingleUser(
      manufacturerAddress
    );
    const distributorUser = await signerDistributor.getSingleUser(
      distributorAddress
    );

    // console.log(manufacturerUser);
    // console.log(distributorUser);
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

  it("should delete the supplier", async function () {
    // Perform the delete operation
    await signerSupplier.deleteUser();

    const user = await signerSupplier.getSingleUser(supplierAddress);
    // console.log(user.userStatus);
    expect(user.userStatus).to.equal(false);
  });

  it("should edit the name of a supplier", async function () {
    const newName = encoder.encode("XYZ Foods PVT. LTD");

    await signerSupplier.editName(newName);

    const user = await signerSupplier.getSingleUser(supplierAddress);
    expect(user.userName).to.equal(byteArrayToHexString(newName));
  });

  it("should edit the physical address of a supplier", async function () {
    const newPhysicalAddress = encoder.encode("789 Elm st, Notown, USA");

    await signerSupplier.editPhysicalAddress(newPhysicalAddress);

    const user = await signerSupplier.getSingleUser(supplierAddress);
    expect(user.userPhysicalAddress).to.equal(
      byteArrayToHexString(newPhysicalAddress)
    );
  });

  it("should edit the image of a supplier", async function () {
    const newImage = encoder.encode("https:/big.webp");

    await signerSupplier.editImage(newImage);

    const user = await signerSupplier.getSingleUser(supplierAddress);
    expect(user.userImage).to.equal(byteArrayToHexString(newImage));
  });

  // --------------------------------------------------------------------test cases for manufacturer
  it("should delete the manufacturer", async function () {
    // Perform the delete operation
    await signerManufacturer.deleteUser();

    const user = await signerManufacturer.getSingleUser(manufacturerAddress);
    // console.log(user);
    expect(user.userStatus).to.equal(false);
  });

  it("should edit the name of a manufacturer", async function () {
    const newName = encoder.encode("XYZ Foods PVT. LTD");

    await signerManufacturer.editName(newName);

    const user = await signerManufacturer.getSingleUser(manufacturerAddress);
    expect(user.userName).to.equal(byteArrayToHexString(newName));
  });

  it("should edit the physical address of a manufacturer", async function () {
    const newPhysicalAddress = encoder.encode("789 Elm st, Notown, USA");

    await signerManufacturer.editPhysicalAddress(newPhysicalAddress);

    const user = await signerManufacturer.getSingleUser(manufacturerAddress);
    expect(user.userPhysicalAddress).to.equal(
      byteArrayToHexString(newPhysicalAddress)
    );
  });

  it("should edit the image of a manufacturer", async function () {
    const newImage = encoder.encode("https:/big.webp");

    await signerManufacturer.editImage(newImage);

    const user = await signerManufacturer.getSingleUser(manufacturerAddress);
    expect(user.userImage).to.equal(byteArrayToHexString(newImage));
  });

  // --------------------------------------------------------------test cases of Distributor
  it("should delete the Distributor", async function () {
    // Perform the delete operation
    await signerDistributor.deleteUser();

    const user = await signerDistributor.getSingleUser(distributorAddress);
    // console.log(user.userStatus);
    expect(user.userStatus).to.equal(false);
  });

  it("should edit the name of a Distributor", async function () {
    const newName = encoder.encode("XYZ Foods PVT. LTD");

    await signerDistributor.editName(newName);

    const user = await signerDistributor.getSingleUser(distributorAddress);
    expect(user.userName).to.equal(byteArrayToHexString(newName));
  });

  it("should edit the physical address of a Distributor", async function () {
    const newPhysicalAddress = encoder.encode("789 Elm st, Notown, USA");

    await signerDistributor.editPhysicalAddress(newPhysicalAddress);

    const user = await signerDistributor.getSingleUser(distributorAddress);
    expect(user.userPhysicalAddress).to.equal(
      byteArrayToHexString(newPhysicalAddress)
    );
  });

  it("should edit the image of a Distributor", async function () {
    const newImage = encoder.encode("https:/big.webp");

    await signerDistributor.editImage(newImage);

    const user = await signerDistributor.getSingleUser(distributorAddress);
    expect(user.userImage).to.equal(byteArrayToHexString(newImage));
  });

  it("should get all users", async function () {
    const users = await signerSupplier.getAllUsers();

    expect(users.length).to.equal(3);
    expect(users[0].userType).to.equal(0);
    expect(users[1].userType).to.equal(1);
    expect(users[2].userType).to.equal(2);
  });

  it("should get all suppliers", async function () {
    const [supplierAddresses, supplierDetails] =
      await signerSupplier.getAllSuppliers();

    expect(supplierAddresses.length).to.equal(1);
    expect(supplierDetails[0].userType).to.equal(0);

    expect(supplierDetails[0].userName).to.equal(
      byteArrayToHexString(supplierData.name)
    );
  });

  it("should get all manufacturers", async function () {
    const [manufacturerAddresses, manufacturerDetails] =
      await signerManufacturer.getAllManufacturers();

    expect(manufacturerAddresses.length).to.equal(1);
    expect(manufacturerDetails[0].userType).to.equal(1);

    expect(manufacturerDetails[0].userName).to.equal(
      byteArrayToHexString(manufacturerData.name)
    );
  });

  it("should get all distributors", async function () {
    const [distributorAddresses, distributorDetails] =
      await signerDistributor.getAllDistributors();
    expect(distributorAddresses.length).to.equal(1);
    expect(distributorDetails[0].userType).to.equal(2);

    expect(distributorDetails[0].userName).to.equal(
      byteArrayToHexString(distributorData.name)
    );
  });
});
