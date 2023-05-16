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
    constructor(address _udAddress,address _mpAddress) {
        owner = msg.sender;
        udInstance = userDetails(_udAddress);
        mpInstance = manufacturerProduct(_mpAddress);

    }

    struct manufacturerDistributorWithDetails {
    manufacturerDistributor mdDetails;
    manufacturerProduct.manufacturerProduct mpDetails;
    userDetails.userDetails uDetails;
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
    function transferProduct(uint _mdId,uint _mpId,address _distributorAddress,uint32 _quantity)external override{
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 1,"Only manufacturer can Transfer product"); 

        mpInstance.updateManufactureProductTransfer(_mpId,_distributorAddress);
        mdIdToStructMapping[_mdId].status = transferStatus.Approved;
        // mdIdToStructMapping[mdId].mpId = _mpId;
        // mdIdToStructMapping[mdId].m_address = msg.sender;
        // mdIdToStructMapping[mdId].dispatchTime = uint32(block.timestamp);
        // mdIdToStructMapping[mdId].currentQuantity = _currentQuantity;
        // mdIdToStructMapping[mdId].status = transferStatus.Approved;
        
        emit eventManufacturerDistributorTransfer(_mdId,_mpId,msg.sender,_distributorAddress,uint32(block.timestamp));
        mpInstance.updateManufacturerProductUints(_mpId,_quantity);
    }

    function requestProduct(uint _mpId,uint32 _quantity, address _manufacturerAddress)external override {
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType)== 2,"Only Distributor can Request product"); 

        mdIdToStructMapping[mdId] = manufacturerDistributor(mdId,_mpId,_manufacturerAddress,msg.sender,0,0,_quantity,0,transferStatus.Requested);
        distributorTomdIdMapping[msg.sender].push(mdId);
        manufacturerTosmIdMapping[msg.sender].push(mdId);
        mdId++;
    }
    
    /// @notice function to update that the product has been received
    function receiveProduct(uint _mpId,uint _mdId)external override{
        userDetails.userDetails memory user = udInstance.getSingleUser(msg.sender);
        require(uint8(user.userType) == 2,"Only Distributor can acknowledge received product"); 
        
        mpInstance.updateManufactureProductReceived(_mpId);
        mdIdToStructMapping[_mdId].status = transferStatus.Received;

        emit eventArrivalTime(uint32(block.timestamp));
    } 

    /// @notice function to get all transfer information
    function getProduct(uint _mdid) public view returns(manufacturerDistributor memory){
        return mdIdToStructMapping[_mdid];
    }

    /// @notice function to get all trasnfers distributor has received
    function getAllmdIdForDistributor(address _distributorAddress) public view returns(manufacturerDistributorWithDetails[] memory){  
        uint[] memory mdIdData = distributorTomdIdMapping[_distributorAddress];
        manufacturerDistributorWithDetails[] memory mdIdDetails = new manufacturerDistributorWithDetails[](mdIdData.length);
        for(uint i=0;i<mdIdData.length;i++)
        {
            mdIdDetails[i].mdDetails = mdIdToStructMapping[mdIdData[i]];
            mdIdDetails[i].mpDetails = mpInstance.getSingleManufacturerProduct(mdIdDetails[i].mdDetails.mpId);
            mdIdDetails[i].uDetails = udInstance.getSingleUser(mdIdDetails[i].mdDetails.d_address);

        }
        return mdIdDetails;
    }

     function getAllmdIdForManufacturer(address _manufacturerAddress) public view returns(manufacturerDistributorWithDetails[] memory){  
        uint[] memory mdIdData = distributorTomdIdMapping[_manufacturerAddress];
        manufacturerDistributorWithDetails[] memory mdIdDetails = new manufacturerDistributorWithDetails[](mdIdData.length);
        for(uint i=0;i<mdIdData.length;i++)
        {
            mdIdDetails[i].mdDetails = mdIdToStructMapping[mdIdData[i]];
            mdIdDetails[i].mpDetails = mpInstance.getSingleManufacturerProduct(mdIdDetails[i].mdDetails.mpId);
            mdIdDetails[i].uDetails = udInstance.getSingleUser(mdIdDetails[i].mdDetails.m_address);

        }
        return mdIdDetails;
    }
}   