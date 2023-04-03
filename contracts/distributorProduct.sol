// SPDX-License-Identifier: GPL-3.0
import "./Interfaces/IDistributorProduct.sol";
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling distributor' product
/// @notice Uses IDistributorProduct interface

contract distributorProduct is IDistributorProduct{
    /// @notice variable to keep track of product index
    uint dpId = 1;

    /// @notice mapping product index with distributorProduct struct
    mapping(uint => distributorProduct) public distributorProductsIdToStructMapping;

    /// @notice mapping user' address with all the created products
    mapping(address => uint[]) public distributorAddressToproductsIdMapping;

    // struct
        //   address[] manufacturerAddress;
        //   uint[] md_id;    
        //   bytes dp_name;
        //   bytes dp_description;
        //   uint128 dp_unit;
        //   uint128 dp_price;
        //   uint32 dp_date;
        //   uint32 dp_expiryDate;
        //   bool dp_status;

        // events
            // eventAddDistributorProduct
            // eventDeleteDistributorProduct
            // eventUpdateDistributorProductUints

    /// @notice function to add distributor product
    function addDistributorProduct(address[] memory _manufacturerAddress,uint[] memory _mdId, bytes calldata _name,bytes calldata _description,uint128 _unit,uint128 _price,uint32 _date,uint32 _expiryDate)public override {
        distributorProductsIdToStructMapping[dpId] = distributorProduct(_manufacturerAddress,_mdId,_name,_description,_unit,_price,_date,_expiryDate,true);
        distributorAddressToproductsIdMapping[msg.sender].push(dpId);
        emit eventAddDistributorProduct(dpId,_manufacturerAddress,_mdId,_name,_description,_unit,_price,_date,_expiryDate);
        dpId++;
    }

    /// @notice function to update distributor product units
    function updateDistributorProductUints(uint _dpId, uint128 _quantity) public override{
        distributorProductsIdToStructMapping[_dpId].dp_unit -= _quantity;  
        emit eventUpdateDistributorProductUints(_dpId, distributorProductsIdToStructMapping[_dpId].dp_unit);
    }

    /// @notice function to return distributor product IDs
    function getDistributorProductIds() public view returns(uint[] memory){
        return distributorAddressToproductsIdMapping[msg.sender];
    }

    /// @notice function to return distributor' single product
    function getSingleDistributorProduct(uint _dpId) public view returns(distributorProduct memory){
        return distributorProductsIdToStructMapping[_dpId];
    }

    /// @notice function to get all distributor products that it created on the platform
    function getAllProductsOfDistributor(address _distributorAddress) public view returns(distributorProduct[] memory)
    {
        uint[] memory productIds= distributorAddressToproductsIdMapping[_distributorAddress];
        distributorProduct[] memory DistributorP = new distributorProduct[](productIds.length);
        for(uint i=0;i<productIds.length;i++)
        {
            DistributorP[i] =distributorProductsIdToStructMapping[productIds[i]];
        }
        return DistributorP;
    }

    /// @notice function to delete distributor product (making the product Inactive)
    function deleteDistributorProduct(uint _dpId)external override{
        distributorProductsIdToStructMapping[_dpId].dp_status=false;
        emit eventDeleteDistributorProduct(_dpId);
    }
}