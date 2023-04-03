// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.19;

interface IManufacturerDistributor {
  struct manufacturerDistributor{
      uint mpId;
      address m_address;
      address d_address;
      uint32 dispatchTime;
      uint32 arrivalTime;
  }

  event eventManufacturerDistributorTransfer(uint indexed _mdId,uint indexed _mpId, address _manufacturerAddress,address _distributorAddress,uint32 _dispatchTime);
  event eventArrivalTime(uint32 _arrivalTime);
  
  function transferproduct(uint _mpId, address _manufacturerAddress,address _distributorAddress,uint32 _dispatchTime)external;
  function receiveProduct(uint _mdId)external;
}