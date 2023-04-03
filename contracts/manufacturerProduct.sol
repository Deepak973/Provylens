// SPDX-License-Identifier: GPL-3.0
import "./Interfaces/IManufacturerProduct.sol";
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling manufacturer' product
/// @notice Uses IManufacturerProduct interface

contract manufacturerProduct is IManufacturerProduct{
    /// @notice variable to keep track of product index
    uint mpId = 1;

    /// @notice mapping product index with manufacturerProduct struct
    mapping(uint => manufacturerProduct) public manufacturerProductsIdToStructMapping;

    /// @notice mapping user' address with all the created products
    mapping(address => uint[]) public manufacturerAddressToproductsIdMapping;

    //struct
        // address[] supplierAddress;
        // uint[] smId;    
        // bytes mp_name;
        // bytes mp_description;
        // uint128 mp_unit;
        // uint128 mp_price;
        // uint32 mp_date;
        // uint32 mp_expiryDate;
        // bool mp_status;

    // events
        // eventAddManufacturerProduct
        // eventDeleteManufacturerProduct
        // eventUpdateManufacturerProductUints

    /// @notice function to add manufacturer product
    function addManufacturerProduct(
        address[] memory _supplierAddress,
        uint[] memory _smId,
        bytes calldata _name,
        bytes calldata _description,
        uint128 _unit,
        uint128 _price,
        uint32 _date,
        uint32 _expiryDate
    )public override {
        manufacturerProductsIdToStructMapping[mpId] = manufacturerProduct(_supplierAddress,_smId,_name,_description,_unit,_price,_date,_expiryDate,true);
        manufacturerAddressToproductsIdMapping[msg.sender].push(mpId);
        emit eventAddManufacturerProduct(mpId,_supplierAddress,_smId,_name,_description,_unit,_price,_date,_expiryDate);
        mpId++;
    }

    /// @notice function to update manufacturer product units
    function updateManufacturerProductUints(uint _mpId, uint128 _quantity) public override{
        manufacturerProductsIdToStructMapping[_mpId].mp_unit -= _quantity;  
        emit eventUpdateManufacturerProductUints(_mpId, manufacturerProductsIdToStructMapping[_mpId].mp_unit);
    }

    /// @notice function to return manufacturer product IDs
    function getManufacturerProductIds() public view returns(uint[] memory){
        return manufacturerAddressToproductsIdMapping[msg.sender];
    }

    /// @notice function to return manufacturer' single product
    function getSingleManufacturerProduct(uint _mpId) public view returns(manufacturerProduct memory){
        return manufacturerProductsIdToStructMapping[_mpId];
    }

    /// @notice function to get all manufacturer products that it created on the platform
    function getAllProductsOfManufacturer(address _manufacturerAddress) public view returns(manufacturerProduct[] memory)
    {
        uint[] memory productIds= manufacturerAddressToproductsIdMapping[_manufacturerAddress];
        manufacturerProduct[] memory ManufacturerP = new manufacturerProduct[](productIds.length);
        for(uint i=0;i<productIds.length;i++)
        {
            ManufacturerP[i] =manufacturerProductsIdToStructMapping[productIds[i]];
        }
        return ManufacturerP;
    }

    /// @notice function to delete manufacturer product (making the product Inactive)
    
    function deleteManufacturerProduct(uint _mpId)external override{
        manufacturerProductsIdToStructMapping[_mpId].mp_status=false;
        emit eventDeleteManufacturerProduct(_mpId);
    }
}