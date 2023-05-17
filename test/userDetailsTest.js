const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("userDetails", function () {
  let userDetailsInstance;
  let userAddress;
  let supplierAddress;
  let manufacturerAddress;
  let distributorAddress;

  beforeEach(async function () {
    const UserDetails = await ethers.getContractFactory("userDetails");
    userDetailsInstance = await UserDetails.deploy();
    await userDetailsInstance.deployed();
    const signers = await ethers.getSigners();

    userAddress = signers[0].address;
    supplierAddress = signers[1].address;
    manufacturerAddress = signers[2].address;
    distributorAddress = signers[3].address;
  });

  it("should add a user", async function () {
    const userType = 1; // Assuming 1 represents 'Supplier' as per the contract
    const name = ethers.utils.formatBytes32String("John Doe");
    const physicalAddress = ethers.utils.formatBytes32String("123 Main St");
    const image = ethers.utils.formatBytes32String("image data");

    await userDetailsInstance.addUser(userType, name, physicalAddress, image);
    console.log("address: ");
    console.log(supplierAddress);

    const user = await userDetailsInstance.getSingleUser(userAddress);
    console.log("name:");
    console.log(user.userName);
    console.log("Paddress");
    console.log(user.userPhysicalAddress);
    console.log("Imahge");
    console.log(user.userImage);
    expect(user.userName).to.equal(name);
    expect(user.userPhysicalAddress).to.equal(physicalAddress);
    expect(user.userImage).to.equal(image);
  });

  it("should delete a user", async function () {
    await userDetailsInstance.deleteUser();

    const user = await userDetailsInstance.getSingleUser(userAddress);
    expect(user.userStatus).to.equal(false);
  });

  it("should edit the name of a user", async function () {
    const newName = ethers.utils.formatBytes32String("Jane Doe");

    await userDetailsInstance.editName(newName);

    const user = await userDetailsInstance.getSingleUser(userAddress);
    expect(user.userName).to.equal(newName);
  });

  it("should edit the physical address of a user", async function () {
    const newPhysicalAddress = ethers.utils.formatBytes32String("456 Oak St");

    await userDetailsInstance.editPhysicalAddress(newPhysicalAddress);

    const user = await userDetailsInstance.getSingleUser(userAddress);
    expect(user.userPhysicalAddress).to.equal(newPhysicalAddress);
  });

  it("should edit the image of a user", async function () {
    const newImage = ethers.utils.formatBytes32String("new image data");

    await userDetailsInstance.editImage(newImage);

    const user = await userDetailsInstance.getSingleUser(userAddress);
    expect(user.userImage).to.equal(newImage);
  });

  it("should get all users", async function () {
    await userDetailsInstance.addUser(
      1,
      ethers.utils.formatBytes32String("Jane Doe"),
      ethers.utils.formatBytes32String("123 Main St"),
      ethers.utils.formatBytes32String("image data")
    );

    const users = await userDetailsInstance.getAllUsers();

    expect(users.length).to.equal(1);
    expect(users[0].userType).to.equal(1);
    expect(users[0].userName).to.equal(
      ethers.utils.formatBytes32String("Jane Doe")
    );
  });

  // it("should get all suppliers", async function () {
  //   await userDetailsInstance.addUser(
  //     0,
  //     ethers.utils.formatBytes32String("Jane Doe"),
  //     ethers.utils.formatBytes32String("123 Main St"),
  //     ethers.utils.formatBytes32String("image data"),
  //     { from: supplierAddress }
  //   );

  //   const [supplierAddresses, supplierDetails] =
  //     await userDetailsInstance.getAllSuppliers();
  //   console.log("from gettimng all");
  //   console.log(supplierAddresses);
  //   console.log(supplierAddresses.length);
  //   console.log(supplierAddresses[0]);
  //   console.log(supplierAddresses[0].userName);
  //   console.log(userAddress);
  //   console.log(supplierAddress);
  //   console.log(manufacturerAddress);
  //   console.log(distributorAddress);

  //   expect(supplierAddresses.length).to.equal(1); // Update expectation to 1
  //   expect(supplierAddresses[0]).to.equal(supplierAddress);
  //   expect(supplierDetails[0].userName).to.equal(
  //     ethers.utils.formatBytes32String("Jane Doe")
  //   );
  // });
  it("should get all suppliers", async function () {
    const userDetailsWithSigner = await userDetailsInstance.connect(
      ethers.provider.getSigner(supplierAddress)
    );

    await userDetailsWithSigner.addUser(
      0,
      ethers.utils.formatBytes32String("Jane Doe"),
      ethers.utils.formatBytes32String("123 Main St"),
      ethers.utils.formatBytes32String("image data")
    );

    const [supplierAddresses, supplierDetails] =
      await userDetailsInstance.getAllSuppliers();

    expect(supplierAddresses.length).to.equal(1);
    expect(supplierAddresses[0]).to.equal(supplierAddress);
    expect(supplierDetails[0].userName).to.equal(
      ethers.utils.formatBytes32String("Jane Doe")
    );
  });

  it("should get all manufacturers", async function () {
    const [manufacturerAddresses, manufacturerDetails] =
      await userDetailsInstance.getAllManufacturers();
    expect(manufacturerAddresses.length).to.equal(0);
  });

  it("should get all distributors", async function () {
    const [distributorAddresses, distributorDetails] =
      await userDetailsInstance.getAllDistributors();
    expect(distributorAddresses.length).to.equal(0);
  });
});
