// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <=0.8.19;

import "./Interfaces/ISupplierManufacturer.sol";
import "./userDetails.sol";
import "./supplierProduct.sol";

/// @title The contract for handling transfer between supplier and manufacturer product
/// @notice Uses ISupplierManufacturer interface
contract supplierManufacturer is ISupplierManufacturer{

    uint public smId = 1; // counter for tracking the number of supplierManufacturer instances
    uint public reqId = 1; // counter for tracking the number of requests made by the manufacturer

    userDetails udInstance; // instance of userDetails contract
    supplierProduct spInstance; // instance of supplierProduct contract
    address owner; // address of the contract owner

    constructor(address _udAddress, address _spAddress) {
        owner = msg.sender;
        udInstance = userDetails(_udAddress);
        spInstance = supplierProduct(_spAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice Changes the contract owner
    /// @param _ownerAddress The new owner's address
    function changeOwner(address _ownerAddress) public onlyOwner{
        owner = _ownerAddress;
    }

    /// @notice Changes the address of the userDetails contract
    /// @param _udAddress The new userDetails contract address
    function changeUdAddress(address _udAddress) public onlyOwner{
        udInstance = userDetails(_udAddress);
    }

    /// @notice Changes the address of the supplierProduct contract
    /// @param _spAddress The new supplierProduct contract address
    function changeSpAddress(address _spAddress) public onlyOwner{
        spInstance = supplierProduct(_spAddress);
    }

    /// @notice Returns an array of all supplier addresses
    /// @return An array of all supplier addresses
    function getAllSupplierAddresses() public view returns(address[] memory){
        return udInstance.getAllSupplierAddresses();
    }

    // struct
       /*    uint sp_id;
          address supplierAddress;
          address manufacturerAddress;
          uint32 dispatchTime;
          uint32 arrivalTime;
          uint32 quantity;
          uint32 currentQuantity;
          transferStatus _status; */

    // events
        /* eventSupplierManufacturerTransfer
        eventArrivalTime */

    // enum transferStatus
       /*  none,
        Requested,  //1
        Approved,   //2
        Received    //3 */

    /// @dev A mapping to associate smId with supplierManufacturer
    mapping(uint => supplierManufacturer) public smIdToStructMapping;

    /// @dev A mapping to associate manufacturer's address with the smId
    mapping(address => uint[]) public manufacturerTosmIdMapping;

    /// @dev A mapping to associate supplier's address with the smId
    mapping(address => uint[]) public supplierTosmIdMapping;

    /// @notice function to transfer product from supplier to manufacturer
    function transferProduct(uint _smId,address _manufacturerAddress,uint32 _quantity,uint32 _currentQuantity)external override{
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 0,"Only Supplier can Transfer product"); 
        address caller = msg.sender;
        uint256[] memory supplierAddresses = spInstance.getSpIdsByAddress(caller);
        bool found = false;
        for (uint i = 0; i < supplierAddresses.length; i++) {
            if (supplierAddresses[i] == smIdToStructMapping[_smId].spId) {
                found = true;
                break;
            }
        }
        require(found, "Product not owned by you");

        smIdToStructMapping[_smId].supplierAddress = msg.sender;
        smIdToStructMapping[_smId].dispatchTime = uint32(block.timestamp);
        smIdToStructMapping[_smId].currentQuantity = _currentQuantity;
        smIdToStructMapping[_smId].status = transferStatus.Approved;
        emit eventSupplierManufacturerTransfer(smId,smIdToStructMapping[_smId].spId,msg.sender,_manufacturerAddress,uint32(block.timestamp));
        spInstance.updateSupplierProductUints(smIdToStructMapping[_smId].spId,_quantity);
    }

    // function testGet()public view returns(uint[] memory){
    //     address caller = msg.sender;
    //     return spInstance.getSpIdsByAddress(caller);
    // }

    function requestProduct(uint _spId,uint32 _quantity, address _supplierAddress)external override {
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 1,"Only Manufacturer can Request product"); 

        smIdToStructMapping[smId] = supplierManufacturer(smId,_spId,_supplierAddress,msg.sender,0,0,_quantity,0,transferStatus.Requested);
        manufacturerTosmIdMapping[msg.sender].push(smId);
        // supplierTosmIdMapping[msg.sender].push(smId);
        supplierTosmIdMapping[_supplierAddress].push(smId);
        smId++;
    }
    
    /// @notice function to update that the product has been received
    function receiveProduct(uint _smId)external override{
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType) == 1,"Only Manufacturer can acknowledge receive product"); 

        smIdToStructMapping[_smId].arrivalTime = uint32(block.timestamp);
        smIdToStructMapping[_smId].status = transferStatus.Received;
        emit eventArrivalTime(uint32(block.timestamp));
    } 

    /// @notice function to get single product transfer information
    function getSmDetails(uint _smId) public view returns(supplierManufacturer memory){
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

    function getAllSmIdForSupplier(address _supplierAddress) public view returns(supplierManufacturer[] memory){
        uint[] memory smIdData = supplierTosmIdMapping[_supplierAddress];
        supplierManufacturer[] memory smIdDetails = new supplierManufacturer[](smIdData.length);
        for(uint i=0;i<smIdData.length;i++)
        {
            smIdDetails[i] = smIdToStructMapping[smIdData[i]];
        }
        return smIdDetails;
    }
}