// SPDX-License-Identifier: GPL-3.0
import "./Interfaces/ISupplierProduct.sol";
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling supplier' product
/// @notice Uses ISupplierProduct interface

contract supplierProduct is ISupplierProduct{
    /// @notice variable to keep track of product index
    uint spId = 1;

    /// @notice mapping product index with supplierProduct struct
    mapping(uint => supplierProduct) public supplierProductsIdToStructMapping;

    /// @notice mapping user' address with all the created products
    mapping(address => uint[]) public supplierAddressToproductsIdMapping;

    // struct
        //  address supplierAddress;
        //   bytes sp_name;
        //   bytes sp_description;
        //   uint128 sp_unit;
        //   uint128 sp_price;
        //   uint32 sp_date;
        //   uint32 sp_expiryDate;
        //   bool sp_status;

    //events
        // eventAddSupplierProduct
        // eventDeleteSupplierProduct
        // eventUpdateSupplierProductUints
    
    /// @notice function to add supplier product
    function addSupplierProduct(bytes calldata _name,bytes calldata _description,uint128 _unit,uint128 _price,uint32 _date,uint32 _expiryDate)public override  {
        supplierProductsIdToStructMapping[spId] = supplierProduct(msg.sender,_name,_description,_unit,_price,_date,_expiryDate,true);
        supplierAddressToproductsIdMapping[msg.sender].push(spId);
        emit eventAddSupplierProduct(spId,msg.sender,_name,_description,_unit,_price,_date,_expiryDate,block.timestamp);
        spId++;
    }

    /// @notice function to update supplier product units
    function updateSupplierProductUints(uint _spId, uint128 _quantity) public override{
        supplierProductsIdToStructMapping[_spId].sp_unit -= _quantity;  
        emit eventUpdateSupplierProductUints(_spId, supplierProductsIdToStructMapping[_spId].sp_unit);
    }

    /// @notice function to return supplier product IDs
    function getSupplierProductIds() public view returns(uint[] memory){
        return supplierAddressToproductsIdMapping[msg.sender];
    }

    /// @notice function to return supplier' single product
    function getSingleSupplierProduct(uint _spId) public view returns(supplierProduct memory){
        return supplierProductsIdToStructMapping[_spId];
    }

    /// @notice function to get all supplier products that it created on the platform
    function getAllProductsOfSupplier(address _supplierAddress) public view returns(supplierProduct[] memory)
    {
        uint[] memory productIds= supplierAddressToproductsIdMapping[_supplierAddress];
        supplierProduct[] memory supplierP = new supplierProduct[](productIds.length);
        for(uint i=0;i<productIds.length;i++)
        {
            supplierP[i] =supplierProductsIdToStructMapping[productIds[i]];
        }
        return supplierP;
    }

    /// @notice function to delete supplier product (making the product Inactive)
    function deleteSupplierProduct(uint _spId)public override {
        supplierProductsIdToStructMapping[_spId].sp_status=false;
        emit eventDeleteSupplierProduct(_spId);
    }
}