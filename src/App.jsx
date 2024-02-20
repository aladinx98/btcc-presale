import React from 'react'
import Footer from './components/footer'
import Header from './components/header'
import MainSection from "./components/main"
import './App.css'
import { Toaster } from 'react-hot-toast'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bsc } from 'viem/chains'


const chains = [ bsc ];
const projectId = 'a8cf14512b28ef4948075e9535a5d2cc';

const { publicClient } = configureChains( chains, [ w3mProvider( { projectId } ) ] );
const wagmiConfig = createConfig( {
  autoConnect: true,
  connectors: w3mConnectors( { projectId, chains } ),
  publicClient
} );
const ethereumClient = new EthereumClient( wagmiConfig, chains );

function App() {

  return (
    <>
      <WagmiConfig config={ wagmiConfig }>
        <Toaster />
        <div>
          <Header />
          <MainSection />
          <Footer />
        </div>
      </WagmiConfig>
      <Web3Modal projectId={ projectId } ethereumClient={ ethereumClient } />
    </>
  )
}

export default App
