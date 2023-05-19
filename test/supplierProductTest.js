// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("supplierProduct", function () {

//   beforeEach(async function () {
//     [owner, supplierAddress] = await ethers.getSigners();

//     SupplierProduct = await ethers.getContractFactory("supplierProduct");
//     supplierProduct = await SupplierProduct.deploy(userDetails.address); // Pass userDetails contract address
//     await supplierProduct.deployed();

//     UserDetails = await ethers.getContractFactory("userDetails");
//     userDetails = await UserDetails.deploy();
//     await userDetails.deployed();

//     // Register the user as a supplier
//     await userDetails.addUser(
//       0, // UserType: Supplier
//       ethers.utils.formatBytes32String("Jane Doe"),
//       ethers.utils.formatBytes32String("123 Main St"),
//       ethers.utils.formatBytes32String("image data"),
//       { from: supplierAddress.address }
//     );
//   });

//   it("should add a supplier product", async function () {
//     const name = ethers.utils.formatBytes32String("Product 1");
//     const description = ethers.utils.formatBytes32String("Description 1");
//     const unit = ethers.utils.parseUnits("10", 0);
//     const price = ethers.utils.parseEther("1");
//     const date = Math.floor(Date.now() / 1000);
//     const expiryDate = date + 86400; // 1 day expiry

//     await supplierProduct.addSupplierProduct(
//       name,
//       description,
//       unit,
//       price,
//       date,
//       expiryDate,
//       { from: supplierAddress }
//     );

//     const [supplierProducts, productIds] =
//       await supplierProduct.getAllProductsOfSupplier(supplierAddress.address);

//     expect(productIds.length).to.equal(1);
//     expect(supplierProducts[0].sp_name).to.equal(name);
//     expect(supplierProducts[0].sp_description).to.equal(description);
//     expect(supplierProducts[0].sp_unit).to.equal(unit);
//     expect(supplierProducts[0].sp_price).to.equal(price);
//     expect(supplierProducts[0].sp_date).to.equal(date);
//     expect(supplierProducts[0].sp_expiryDate).to.equal(expiryDate);
//     expect(supplierProducts[0].sp_status).to.equal(true);
//   });

//   it("should update supplier product units", async function () {
//     const productId = 1;
//     const quantity = ethers.utils.parseUnits("5", 0);

//     await supplierProduct.updateSupplierProductUints(
//       productId,
//       quantity,
//       supplierAddress.address,
//       { from: supplierAddress.address }
//     );

//     const [supplierProduct] = await supplierProduct.getSingleSupplierProduct(
//       productId
//     );

//     expect(supplierProduct.sp_unit).to.equal(quantity);
//   });

//   it("should delete a supplier product", async function () {
//     const productId = 1;

//     await supplierProduct.deleteSupplierProduct(productId, {
//       from: supplierAddress.address,
//     });

//     const [supplierProducts, productIds] =
//       await supplierProduct.getAllProductsOfSupplier(supplierAddress.address);

//     expect(productIds.length).to.equal(0);
//     expect(supplierProducts.length).to.equal(0);
//   });
// });
