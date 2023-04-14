// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.19;

interface IManufacturerDistributor {
  enum transferStatus {
    none,
    Requested,  //1
    Approved,   //2
    Received    //3
  } 
  struct manufacturerDistributor{
      uint mdId;
      uint mpId;
      address m_address;
      address d_address;
      uint32 dispatchTime;
      uint32 arrivalTime;
      uint32 quantity;
      uint32 currentQuantity;
      transferStatus status;
  }

  event eventManufacturerDistributorTransfer(uint indexed _mdId,uint indexed _mpId, address _manufacturerAddress,address _distributorAddress,uint32 _dispatchTime);
  event eventArrivalTime(uint32 _arrivalTime);
  
  function transferProduct(uint _mpId,address _distributorAddress,uint32 _quantity)external;
  function requestProduct(uint _mpId,uint32 _quantity, address _supplierAddress)external;
  function receiveProduct(uint _mpId, uint _mdId)external;
}