import React from 'react';
import loader from "../assets/loader.gif";

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner">
        <img src={loader} className="loader"/>
      </div>
    </div>
  );
};

export default Loader;
