// SPDX-License-Identifier: GPL-3.0
import "./Interfaces/ISupplierManufacturer.sol";
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling transfer between supplier and manufacturer product
/// @notice Uses ISupplierManufacturer interface

contract supplierManufacturer is ISupplierManufacturer{
    uint public smId = 1;

    // struct
        //   uint sp_id;
        //   address supplierAddress;
        //   address manufacturerAddress;
        //   uint32 dispatchTime;
        //   uint32 arrivalTime;

    // events
        // eventSupplierManufacturerTransfer
        // eventArrivalTime

    /// @notice mapping smId index with supplierManufacturer
    mapping(uint => supplierManufacturer) public smIdToStructMapping;

    /// @notice mapping address with all the created smIds
    mapping(address => uint[]) public manufacturerTosmIdMapping;

    /// @notice function to transfer product from supplier to manufacturer
    function transferProduct(uint _spId, address _supplierAddress,address _manufacturerAddress,uint32 _dispatchTime)external override{
        smIdToStructMapping[smId] = supplierManufacturer(_spId,_supplierAddress,_manufacturerAddress,_dispatchTime,0);
        manufacturerTosmIdMapping[_manufacturerAddress].push(smId);
        emit eventSupplierManufacturerTransfer(smId,_spId,_supplierAddress,_manufacturerAddress,_dispatchTime);
        smId++;
    } 

    /// @notice function to update that the product has been received
    function receiveProduct(uint _smId)external override{
        smIdToStructMapping[_smId].arrivalTime = uint32(block.timestamp);
        emit eventArrivalTime(uint32(block.timestamp));
    } 

    /// @notice function to get all transfer information
    function getProduct(uint _smId) public view returns(supplierManufacturer memory){
        return smIdToStructMapping[_smId];
    }

    /// @notice function to get all trasnfers manufacturer has received
    function getAllSmIdForManufacturer(address _manufacturerAddress) public view returns(supplierManufacturer[] memory){
        uint[] memory smIdData = manufacturerTosmIdMapping[_manufacturerAddress];
        supplierManufacturer[] memory smIdDetails = new supplierManufacturer[](smIdData.length);
        for(uint i=0;i<smIdData.length;i++)
        {
            smIdDetails[i] = smIdToStructMapping[smIdData[i]];
        }
        return smIdDetails;
    }
}