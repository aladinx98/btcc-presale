import React, { useEffect, useState } from "react";
import './style.css';
import logo from '../../images/bitcoin.png';
import PresaleAbi from '../../Helpers/presaleAbi.json';
import USDTAbi from '../../Helpers/usdtAbi.json';
import TokenModal from './TokenModal';
import { list } from '../../Helpers/tokenlist';
import { FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Web3Button } from '@web3modal/react';
import { useAccount } from 'wagmi';
import Web3 from 'web3';
import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core';

const isValid = ( regex ) => ( input ) => regex.test( input );
const numberRegex = /^\d*\.?\d*$/;
const isValidNumber = isValid( numberRegex );

function MainSection ()
{
  const { isConnected, address } = useAccount(); // Removed 'account'

  const cAddress = "0xEb8250d8E5f6E3FC191c6011Fa4939B7CE23F370";
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";

  const [ data, setData ] = useState( {
    bnb: "",
    gart: "",
  } );
  const [ open, setOpen ] = React.useState( false );
  const [ currentToken, setCurrentToken ] = useState( list[ 0 ] );
  const handleOpen = () => setOpen( true );
  const handleClose = () => setOpen( false );
  const gartVal = currentToken.name === "BNB" ? 2444 : 8;

  const webSupply_Binance = new Web3( "https://1rpc.io/bnb" );

  // BUY WITH BNB
  const processBuy = async () => {
    if (!data.bnb || !data.gart) {
      toast.error("Please enter the correct value.");
      return;
    }
  
    try {
      const contract = new webSupply_Binance.eth.Contract(PresaleAbi, cAddress);
      let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());
  
      const transaction = await prepareWriteContract({
        address: cAddress,
        abi: PresaleAbi,
        functionName: "buyBTCC",
        value: bnbValue,
        from: address,
      });
  
      const toastId = toast.loading("Processing transaction...");
      const receipt = await writeContract(transaction);
  
      toast.success("Transaction completed successfully", { id: toastId });
      setData({ bnb: "", gart: "" });
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };
  

  const buyWithUsdt = async () =>
  {
    if ( !data.bnb || !data.gart )
    {
      toast.error( "Please enter the correct value." );
      return;
    }

    try
    {
      const contract = new webSupply_Binance.eth.Contract( PresaleAbi, cAddress );
      const tokenContract = new webSupply_Binance.eth.Contract( USDTAbi, usdtAddress );
      let bnbValue = webSupply_Binance.utils.toWei( data.bnb.toString() );

      // Convert BigNumber to number
      const bnbValueNumber = Number( bnbValue );

      // Check if allowance already exists
      const allowance = await tokenContract.methods.allowance( address, cAddress ).call();
      console.log( "Allowance:", allowance );

      if ( allowance >= bnbValueNumber )
      {
        // Allowance exists, directly execute buy
        const buyTransaction = await prepareWriteContract( {
          address: cAddress,
          abi: PresaleAbi,
          functionName: "buyWithUSDT",
          args: [ bnbValueNumber ],
          from: address,
        } );

        const toastId = toast.loading( "Processing Transaction.." );
        await writeContract( buyTransaction );

        toast.success( "Transaction completed successfully", { id: toastId } );
        setData( { bnb: "", gart: "" } );
      } else
      {
        // Allowance does not exist, get allowance first
        const approvalTransaction = await prepareWriteContract( {
          address: usdtAddress,
          abi: USDTAbi,
          functionName: "approve",
          args: [ cAddress, bnbValueNumber ],
          from: address,
        } );

        const toastId = toast.loading( "Transaction approve.." );
        const hash = await writeContract( approvalTransaction );

        toast.loading( "Processing Transaction..", { id: toastId } );

        // Wait for the approval transaction to be mined
        await waitForTransaction( hash );

        // Introduce a time interval (e.g., 5 seconds) before executing the buy transaction
        const intervalDuration = 10000; // 15 seconds
        setTimeout( async () =>
        {
          // Check allowance again after approval
          const updatedAllowance = await tokenContract.methods.allowance( address, cAddress ).call();

          if ( updatedAllowance >= bnbValueNumber )
          {

            // Execute buy after getting allowance
            const buyTransaction = await prepareWriteContract( {
              address: cAddress,
              abi: PresaleAbi,
              functionName: "buyWithUSDT",
              args: [ bnbValueNumber ],
              from: address,
            } );

            await writeContract( buyTransaction );

            toast.success( "Transaction completed successfully", { id: toastId } );
            setData( { bnb: "", gart: "" } );

          } else
          {
            // Approval failed
            toast.error( "Insufficient allowance. Please approve a higher amount." );
          }
        }, intervalDuration );
      }
    } catch ( error )
    {
      toast.error( "Something went wrong!" );
      console.error( error );
    }
  };

  const buyToken = async () =>
  {
    if ( isConnected )
    {
      if ( currentToken.name === "BNB" )
      {
        processBuy();
      } else if ( currentToken.name === "USDT" )
      {
        buyWithUsdt();
      } 
    } else
    {
      toast.error( "Please connect your wallet." );
    }
  };

  return (
    <>
    <br></br>
    <br></br>
    <br></br>
    <div className="main-section">
      <div className="main-section-form">
        <p className="headings">BTCC</p>
        <p className="headings">Buy with BNB and USDT</p>
        <div style={ { textAlign: "center", margin: "0.5em 0" } }>
          
        </div>
        <p className="mb-6">
          1 { currentToken.name } = { gartVal } BTCC
        </p>
        <p className="mgtp">Pay with</p>
        <div className="form-group">
          <input
            type="text"
            value={ data.bnb }
            className="text-black"
            onChange={ ( e ) =>
            {
              const val = e.target.value
                .split( "" )
                .filter( ( el ) => isValidNumber( el ) )
                .join( "" );
              setData( {
                ...data,
                bnb: val,
                gart: val * gartVal,
              } );
            } }
          />
          <div
            onClick={ handleOpen }
            className=" cursor-pointer items-center flex"
          >
            <img src={ currentToken.icon } alt="snk" />
            <p>{ currentToken.name }</p>
            <FiChevronDown className="text-black" />
          </div>
        </div>
        <p className="mgtp">You will get</p>
        <div className="form-group">
          <input
            type="text"
            className="text-black"
            value={ data.gart }
            onChange={ ( e ) =>
            {
              const val = e.target.value
                .split( "" )
                .filter( ( el ) => isValidNumber( el ) )
                .join( "" );
              setData( {
                ...data,
                gart: val,
                bnb: val / gartVal,
              } );
            } }
          />
          <div>
            <img src={ logo } alt="snk" />
            <p>BTCC</p>
          </div>
        </div>
        <div style={ { textAlign: "center", margin: "0.5em 0" } }>
          <button className="buy"
            onClick={ buyToken }
            style={ {
              backgroundColor: isConnected ? "white" : "gray",
              color: isConnected ? "black" : "black",
              cursor: isConnected ? "pointer" : "not-allowed",
            } }>
            Buy
          </button>
        </div>

        <div className="smart">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <p>100% Secure smart contract</p>
        </div>
      </div>

      <TokenModal
        open={ open }
        setOpen={ setOpen }
        handleOpen={ handleOpen }
        handleClose={ handleClose }
        currentChain={ currentToken }
        setCurrentChain={ setCurrentToken }
        setData={ setData }
      />
    </div>
    </>
  );
};

export default MainSection;
