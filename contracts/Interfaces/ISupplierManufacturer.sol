// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.19;

interface ISupplierManufacturer {
  struct supplierManufacturer{
      uint spId;
      address supplierAddress;
      address manufacturerAddress;
      uint32 dispatchTime;
      uint32 arrivalTime;
  }

  event eventSupplierManufacturerTransfer(uint indexed _smId,uint indexed _spId, address _supplierAddress,address _manufacturerAddress,uint32 _dispatchTime);
  event eventArrivalTime(uint32 _arrivalTime);
  
  function transferProduct(uint _spId, address _supplierAddress,address _manufacturerAddress,uint32 _dispatchTime)external;
  function receiveProduct(uint smId)external;
}