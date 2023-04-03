// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.19;

interface IDistributorProduct {
  struct distributorProduct{
      address[] manufacturerAddress;
      uint[] md_id;    
      bytes dp_name;
      bytes dp_description;
      uint128 dp_unit;
      uint128 dp_price;
      uint32 dp_date;
      uint32 dp_expiryDate;
      bool dp_status;
  }

  event eventAddDistributorProduct(uint indexed _dpId,address[] indexed _manufacturerAddress,uint[] indexed _mdId,bytes _name, bytes _description, uint128 _unit,uint128 _price,uint32 _date,uint32 _expiryDate);
  event eventDeleteDistributorProduct(uint indexed _dpId);
  event eventUpdateDistributorProductUints(uint indexed _dpId,uint128 _quantity);
  
  function addDistributorProduct(address[] memory _manufacturerAddress,uint[] memory _md_id, bytes calldata _name,bytes calldata _description,uint128 _unit,uint128 _price,uint32 _date,uint32 _expiryDate)external;
  function deleteDistributorProduct(uint _dpId)external;
  function updateDistributorProductUints(uint _dpId,uint128 _quantity) external;

}