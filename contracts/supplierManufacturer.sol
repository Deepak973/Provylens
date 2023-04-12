// SPDX-License-Identifier: GPL-3.0
import "./Interfaces/ISupplierManufacturer.sol";
import "./userDetails.sol";
import "./supplierProduct.sol";
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling transfer between supplier and manufacturer product
/// @notice Uses ISupplierManufacturer interface

contract supplierManufacturer is ISupplierManufacturer{
    uint public smId = 1;
    uint public reqId = 1;
    userDetails udInstance;
    supplierProduct spInstance;
    address owner;
    constructor(address _udAddress, address _spAddress) {
        owner = msg.sender;
        udInstance = userDetails(_udAddress);
        spInstance = supplierProduct(_spAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function changeOwner(address _ownerAddress)public onlyOwner{
        owner = _ownerAddress;
    }

    function changeUdAddress(address _udAddress) public onlyOwner{
        udInstance = userDetails(_udAddress);
    }

    function changeSpAddress(address _spAddress) public onlyOwner{
        spInstance = supplierProduct(_spAddress);
    }

    function getAllSupplierAddresses() public view returns(address[] memory){
        return udInstance.getAllSupplierAddresses();
    }

    // struct
        //   uint sp_id;
        //   address supplierAddress;
        //   address manufacturerAddress;
        //   uint32 dispatchTime;
        //   uint32 arrivalTime;
        //   uint32 quantity;
        //   uint32 currentQuantity;
        //   transferStatus _status;

    // events
        // eventSupplierManufacturerTransfer
        // eventArrivalTime

    // enum transferStatus
        // none,
        // Requested,  //1
        // Approved,   //2
        // Received    //3

    /// @notice mapping smId index with supplierManufacturer
    mapping(uint => supplierManufacturer) public smIdToStructMapping;
   

    mapping(address => uint[]) public manufacturerTosmIdMapping;

    mapping(address => uint[]) public supplierTosmIdMapping;



    /// @notice function to transfer product from supplier to manufacturer
    function transferProduct(uint _spId,address _manufacturerAddress,uint32 _quantity,uint32 _currentQuantity)external override{
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 0,"Only Supplier can Transfer product"); 

        smIdToStructMapping[smId].spId = _spId;
        smIdToStructMapping[smId].supplierAddress = msg.sender;
        smIdToStructMapping[smId].dispatchTime = uint32(block.timestamp);
        smIdToStructMapping[smId].currentQuantity = _currentQuantity;
        smIdToStructMapping[smId].status = transferStatus.Approved;
        emit eventSupplierManufacturerTransfer(smId,_spId,msg.sender,_manufacturerAddress,uint32(block.timestamp));
        spInstance.updateSupplierProductUints(_spId,_quantity);
        
    }

    function requestProduct(uint _spId,uint32 _quantity, address _supplierAddress)external override {
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 1,"Only Manufacturer can Request product"); 

        smIdToStructMapping[smId] = supplierManufacturer(smId,_spId,_supplierAddress,msg.sender,0,0,_quantity,0,transferStatus.Requested);
        manufacturerTosmIdMapping[msg.sender].push(smId);
        supplierTosmIdMapping[msg.sender].push(smId);
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