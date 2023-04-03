// graphQL URL
// https://api.studio.thegraph.com/query/40703/provylens-mumbai/v0.0.1

export const USERDETAILS_CONTRACT_ADDRESS_MUMBAI =
  "0x345a54479E50ef9A0cAB015AF27A48142D40629f"; //verified done

export const SUPPLIERPRODUCT_CONTRACT_ADDRESS_MUMBAI =
  "0x3175bCC44B162941d38325005EBF867769Dec1A3"; //verified done

export const MANUFACTURERPRODUCT_CONTRACT_ADDRESS_MUMBAI =
  "0x3175bCC44B162941d38325005EBF867769Dec1A3"; // verified done

export const DISTRIBUTORPRODUCT_CONTRACT_ADDRESS_MUMBAI =
  "0xb3169F83fdBDFf9b7affc76A3981B8e0049e5Bd9"; // verified done

export const SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_MUMBAI =
  "0xbc04AF6F9DC7D40fC63CF12c5e6Ed6dC0fE6eE4c"; // verified done

export const MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_MUMBAI =
  "0x829D5780E6a31f2B7A9a7B44Cc45bd980baDB081"; // verified done

//Scroll deployed contract address
export const USERDETAILS_CONTRACT_ADDRESS_SCROLL =
  "0xe8880650d8C20472CF594Ba91c720886dFd07cA3";

export const SUPPLIERPRODUCT_CONTRACT_ADDRESS_SCROLL =
  "0xF6fd87A08054Ea4c01B06DcFE6F1464a9a708DF3";

export const SUPPLIERMANUFACTURER_CONTRACT_ADDRESS_SCROLL =
  "0xd53aBA0deA01B924B38808C9e6eACF14C3FD8F86";

export const MANUFACTURERPRODUCT_CONTRACT_ADDRESS_SCROLL =
  "0xc74799946f5aedFd6A0DaFb1B475606542A5A497";

export const MANUFACTURERDISTRIBUTOR_CONTRACT_ADDRESS_SCROLL =
  "0xcFbF41Eab7401D3475825e6D3BEe4887b26b8Bbe";

export const DISTRIBUTORPRODUCT_CONTRACT_ADDRESS_SCROLL =
  "0xca31f2E4A6595586A617Ae6bf194EfcB243C187e";

// npx hardhat verify 0x829D5780E6a31f2B7A9a7B44Cc45bd980baDB081 --network mumbai

// scroll deployed address
// 0xe8880650d8C20472CF594Ba91c720886dFd07cA3 userDetails
// 0xF6fd87A08054Ea4c01B06DcFE6F1464a9a708DF3 supplierProduct
// 0xc74799946f5aedFd6A0DaFb1B475606542A5A497  manufacturerProduct
// 0xca31f2E4A6595586A617Ae6bf194EfcB243C187e  distributorProduct
// 0xd53aBA0deA01B924B38808C9e6eACF14C3FD8F86  supplierManufacturer
// 0xcFbF41Eab7401D3475825e6D3BEe4887b26b8Bbe manufacturerDistributor

//after changes
// Contract userDetails deployed to: 0x345a54479E50ef9A0cAB015AF27A48142D40629f  //verified
// Contract supplierProduct deployed to: 0x3175bCC44B162941d38325005EBF867769Dec1A3   //verified
// Contract manufacturerProduct deployed to: 0x3175bCC44B162941d38325005EBF867769Dec1A3   //verified
// Contract distributorProduct deployed to: 0xb3169F83fdBDFf9b7affc76A3981B8e0049e5Bd9    //verified
// Contract supplierManufacturer deployed to: 0xbc04AF6F9DC7D40fC63CF12c5e6Ed6dC0fE6eE4c    //verified
// Contract manufacturerDistributor deployed to: 0x829D5780E6a31f2B7A9a7B44Cc45bd980baDB081   //verified

// ------------------------All events

// 1 eventUserData
// 2 eventDeleteUser

// 3 eventAddSupplierProduct
// 4 eventDeleteSupplierProduct
// 5 eventUpdateSupplierProductUints

// 6 eventAddManufacturerProduct
// 7 eventDeleteManufacturerProduct
// 8 eventUpdateManufacturerProductUints

// 9 eventAddDistributorProduct
// 10 eventDeleteDistributorProduct
// 11 eventUpdateDistributorProductUints

// 12 eventSupplierManufacturerTransfer
// 13 eventArrivalTime

// 14 eventManufacturerDistributorTransfer
// 15 eventArrivalTime
