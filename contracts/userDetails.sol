// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <=0.8.19;

/// @author ProvyLens team
/// @title The contract for handling userData
/// @notice Uses IUserDetails interface

import "./Interfaces/IUserDetails.sol" ;

contract userDetails is IUserDetails{
    /// @notice mapping address with userDetails struct
    mapping(address=>userDetails) public userDetailsMapping;

    /// @notice array to keep track of user' catogery
    address[] public users;
    address[] public suppliers;
    address[] public manufacturers;
    address[] public distributors;

    // struct
        // eventUserData
        // eventDeleteUser
        
    /// @notice function to add the user
    function addUser(userType _type, bytes calldata _name, bytes calldata _physicalAddress,bytes memory _image)public override {
        require((userDetailsMapping[msg.sender].userName).length == 0, "User already registered");
        userDetailsMapping[msg.sender] = userDetails(_type,_name,_physicalAddress,_image, true);
        users.push(msg.sender);
        if(_type == userType.Supplier) suppliers.push(msg.sender);
        if(_type == userType.Manufacturer) manufacturers.push(msg.sender);
        if(_type == userType.Distributor) distributors.push(msg.sender);
        emit eventUserData(msg.sender,_type,_name,_physicalAddress,_image,block.timestamp);
    }

    /// @notice Function to delete the user
    function deleteUser()public override {
        require((userDetailsMapping[msg.sender].userName).length != 0, "User not registered");
        userDetailsMapping[msg.sender].userStatus = false;
        emit eventDeleteUser(msg.sender);
    }

    /// @notice function to edit the name of the user
    function editName(bytes memory _name)public override {
        require((userDetailsMapping[msg.sender].userName).length != 0, "User not registered");

        userDetailsMapping[msg.sender].userName = _name;
        userDetails memory u = userDetailsMapping[msg.sender];
        emit eventUserData(msg.sender,u.userType,_name,u.userPhysicalAddress,u.userImage,block.timestamp);
    }

    /// @notice function to edit the physical address of the user
    function editPhysicalAddress(bytes memory _physicalAddress)public override{
        require((userDetailsMapping[msg.sender].userName).length != 0, "User not registered");
        userDetailsMapping[msg.sender].userPhysicalAddress = _physicalAddress;
        userDetails memory u = userDetailsMapping[msg.sender];
        emit eventUserData(msg.sender,u.userType,u.userName,_physicalAddress,u.userImage,block.timestamp);

    }

    /// @notice function to edit the Image of the user
    function editImage(bytes memory _image)public override {
        require((userDetailsMapping[msg.sender].userName).length != 0, "User not registered");
        userDetailsMapping[msg.sender].userImage = _image;
        userDetails memory u = userDetailsMapping[msg.sender];
        emit eventUserData(msg.sender,u.userType,u.userName,u.userImage,_image,block.timestamp);
    }

    /// @notice function to return user details of any perticular user
    function getSingleUser(address _address) public view returns(userDetails memory){
        return userDetailsMapping[_address];
    }

    /// @notice function to return all the users registered on provyLens
    function getAllUsers() public view returns(userDetails[] memory){
        userDetails[] memory userD = new userDetails[](users.length);
        for(uint i=0;i<users.length;i++)
        {
            userD[i] = userDetailsMapping[users[i]];
        }
        return userD;
    }

    /// @notice function to return all the users registered as suppliers
    function getAllSuppliers() public view returns(address[] memory, userDetails[] memory) {
        address[] memory suppAddresses = new address[](suppliers.length);
        userDetails[] memory suppDetails = new userDetails[](suppliers.length);

        for(uint i=0; i<suppliers.length; i++) {
            address suppAddress = suppliers[i];
            userDetails memory details = userDetailsMapping[suppAddress];
            suppAddresses[i] = suppAddress;
            suppDetails[i] = details;
        }

        return (suppAddresses, suppDetails);
    }

    

    /// @notice function to return all the users registered as manufacturers
    function getAllManufacturers() public view returns (address[] memory, userDetails[] memory) {
        address[] memory manuAddresses = new address[](manufacturers.length);
        userDetails[] memory manuDetails = new userDetails[](manufacturers.length);

        for (uint i = 0; i < manufacturers.length; i++) {
            address manuAddress = manufacturers[i];
            userDetails memory details = userDetailsMapping[manuAddress];
            manuAddresses[i] = manuAddress;
            manuDetails[i] = details;
        }

        return (manuAddresses, manuDetails);
    }

    /// @notice function to return all the users registered as distributors
    function getAllDistributors() public view returns (address[] memory, userDetails[] memory) {
        address[] memory distAddresses = new address[](distributors.length);
        userDetails[] memory distDetails = new userDetails[](distributors.length);

        for (uint i = 0; i < distributors.length; i++) {
            address distAddress = distributors[i];
            userDetails memory details = userDetailsMapping[distAddress];
            distAddresses[i] = distAddress;
            distDetails[i] = details;
        }

        return (distAddresses, distDetails);
    }

    function getAllSupplierAddresses() public view returns(address[] memory) {
        return suppliers;
    }
    function getAllManufacturerAddresses() public view returns(address[] memory) {
        return manufacturers;
    }
    function getAllDistributorAddresses() public view returns(address[] memory) {
        return distributors;
    }
}