import React, { useState } from 'react';
import SidBar from '../Said/SidBar';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';



const Sidebar = () => {
  return (
  <>
  
    <Outlet/>
    <SidBar/>
  </>
 
  );
};

export default Sidebar;
