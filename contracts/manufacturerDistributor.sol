// SPDX-License-Identifier: GPL-3.0
import "./Interfaces/IManufacturerDistributor.sol";
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling transfer between manufacturer and distributor product
/// @notice Uses ISupplierManufacturer interface

contract manufacturerDistributor is IManufacturerDistributor{
    uint public mdId = 1;
    // struct
        //   uint _mpId;
        //   address _manufacturerAddress;
        //   address _distributorAddress;
        //   bytes dispatchTime;
        //   bytes arrivalTime;

    // events
        //     eventManufacturerDistributorTransfer
        //     eventArrivalTime

    /// @notice mapping mdId index with manufacturerDistributor
    mapping(uint => manufacturerDistributor) public mdIdToStructMapping;

    /// @notice mapping address with all the created mdIds
    mapping(address => uint[]) public distributorTosmIdMapping;

    /// @notice function to transfer product from manufacturer to distributor
    function transferproduct(uint _mpId, address _manufacturerAddress,address _distributorAddress,uint32 _dispatchTime)external override{
        mdIdToStructMapping[mdId] = manufacturerDistributor(_mpId,_manufacturerAddress,_distributorAddress,_dispatchTime,0);
        distributorTosmIdMapping[_distributorAddress].push(mdId);
        emit eventManufacturerDistributorTransfer(mdId,_mpId,_manufacturerAddress,_distributorAddress,_dispatchTime);
        mdId++;
    } 

    /// @notice function to update that the product has been received
    function receiveProduct(uint _mdId)external override{
        mdIdToStructMapping[_mdId].arrivalTime = uint32(block.timestamp);
        emit eventArrivalTime(uint32(block.timestamp));
        
    } 

    /// @notice function to get all transfer information
    function getProduct(uint _mdid) public view returns(manufacturerDistributor memory){
        return mdIdToStructMapping[_mdid];
    }

    /// @notice function to get all trasnfers distributor has received
    function getAllmdIdForDistributor(address _distributorAddress) public view returns(manufacturerDistributor[] memory){  
        uint[] memory mdIdData = distributorTosmIdMapping[_distributorAddress];
        manufacturerDistributor[] memory mdIdDetails = new manufacturerDistributor[](mdIdData.length);
        for(uint i=0;i<mdIdData.length;i++)
        {
            mdIdDetails[i] = mdIdToStructMapping[mdIdData[i]];
        }
        return mdIdDetails;
    }
}