import React from 'react'
import Logo from '../../images/bitcoin.png'
import './style.css'
import { Web3Button } from '@web3modal/react'

function Header() {
  

  return (
    <div className="header">
      <img src={Logo} alt="logo" />
      <div>
      <Web3Button />
      </div>
    </div>
  );
};

export default Header;
