// SPDX-License-Identifier: GPL-3.0
import "./Interfaces/IManufacturerDistributor.sol";
import "./userDetails.sol";
import "./manufacturerProduct.sol";
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling transfer between manufacturer and distributor product
/// @notice Uses ISupplierManufacturer interface

contract manufacturerDistributor is IManufacturerDistributor{
    uint public mdId = 1;

    userDetails udInstance;
    manufacturerProduct mpInstance;
    address owner;
    constructor(address _udAddress) {
        owner = msg.sender;
        udInstance = userDetails(_udAddress);
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

    function changeMpAddress(address _mpAddress) public onlyOwner{
        mpInstance = manufacturerProduct(_mpAddress);
    }
   
    // struct
        //   uint _mpId;
        //   address _manufacturerAddress;
        //   address _distributorAddress;
        //   bytes dispatchTime;
        //   bytes arrivalTime;

    // events
        //     eventManufacturerDistributorTransfer
        //     eventArrivalTime

    /// @notice mapping mdId index with supplierManufacturer
    mapping(uint => manufacturerDistributor) public mdIdToStructMapping;
   

    mapping(address => uint[]) public distributorTomdIdMapping;

    mapping(address => uint[]) public manufacturerTosmIdMapping;

    /// @notice function to transfer product from supplier to manufacturer
    function transferProduct(uint _mpId,address _distributorAddress,uint32 _quantity,uint32 _currentQuantity)external override{
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 0,"Only Supplier can Transfer product"); 

        mdIdToStructMapping[mdId].mpId = _mpId;
        mdIdToStructMapping[mdId].m_address = msg.sender;
        mdIdToStructMapping[mdId].dispatchTime = uint32(block.timestamp);
        mdIdToStructMapping[mdId].currentQuantity = _currentQuantity;
        mdIdToStructMapping[mdId].status = transferStatus.Approved;
        
        emit eventManufacturerDistributorTransfer(mdId,_mpId,msg.sender,_distributorAddress,uint32(block.timestamp));
        mpInstance.updateManufacturerProductUints(_mpId,_quantity);
    }

    function requestProduct(uint _mpId,uint32 _quantity, address _manufacturerAddress)external override {
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 1,"Only Manufacturer can Request product"); 

        mdIdToStructMapping[mdId] = manufacturerDistributor(mdId,_mpId,_manufacturerAddress,msg.sender,0,0,_quantity,0,transferStatus.Requested);
        distributorTomdIdMapping[msg.sender].push(mdId);
        manufacturerTosmIdMapping[msg.sender].push(mdId);
        mdId++;
    }
    
    /// @notice function to update that the product has been received
    function receiveProduct(uint _smId)external override{
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType) == 1,"Only Distributor can acknowledge received product"); 
        
        mdIdToStructMapping[_smId].arrivalTime = uint32(block.timestamp);
        mdIdToStructMapping[_smId].status = transferStatus.Received;
        emit eventArrivalTime(uint32(block.timestamp));
    } 

    /// @notice function to get all transfer information
    function getProduct(uint _mdid) public view returns(manufacturerDistributor memory){
        return mdIdToStructMapping[_mdid];
    }

    /// @notice function to get all trasnfers distributor has received
    function getAllmdIdForDistributor(address _distributorAddress) public view returns(manufacturerDistributor[] memory){  
        uint[] memory mdIdData = distributorTomdIdMapping[_distributorAddress];
        manufacturerDistributor[] memory mdIdDetails = new manufacturerDistributor[](mdIdData.length);
        for(uint i=0;i<mdIdData.length;i++)
        {
            mdIdDetails[i] = mdIdToStructMapping[mdIdData[i]];
        }
        return mdIdDetails;
    }
}