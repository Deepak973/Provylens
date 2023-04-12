// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.19;

interface ISupplierManufacturer {
  enum transferStatus {
    none,
    Requested,  //1
    Approved,   //2
    Received    //3
  } 

  struct supplierManufacturer{
      uint smId;
      uint spId;
      address supplierAddress;
      address manufacturerAddress;
      uint32 dispatchTime;
      uint32 arrivalTime;
      uint32 quantity;
      uint32 currentQuantity;
      transferStatus status;
  }

  struct requestDetails{
      uint spId;
      address supplierAddress;
      address manufacturerAddress;
      uint quantity;
      transferStatus transferStatus;
  }

  event eventSupplierManufacturerTransfer(uint indexed _smId,uint indexed _spId, address _supplierAddress,address _manufacturerAddress,uint32 _dispatchTime);
  event eventArrivalTime(uint32 _arrivalTime);
  
  function transferProduct(uint _spId, address _manufacturerAddress,uint32 _quantity,uint32 _currentQuantity)external;
  function requestProduct(uint _spId,uint32 _quantity, address _supplierAddress)external;
  function receiveProduct(uint smId)external;
}