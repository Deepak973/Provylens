import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
// import { scrollTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import Particles from "./components/Particles";
import VerifyProduct from "./components/VerifyProduct";
import Profile from "./components/Profile";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Chat } from "@pushprotocol/uiweb";

function App() {
  const [address, setAddress] = useState();
  async function getAddressFromMetaMask() {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    // Request access to the user's accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create an Ethers.js provider with MetaMask as the signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Get the user's address
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
    return address;
  }
  const { chains, provider } = configureChains(
    [polygonMumbai],
    [
      alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  useEffect(() => {
    getAddressFromMetaMask();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <div className="App">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="register" element={<Register />} />
              <Route path="/open-existing-dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/verify-product" element={<VerifyProduct />} />
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
      <Chat
        account={address} //user address
        supportAddress="0xe57f4c84539a6414C4Cf48f135210e01c477EFE0" //support address
      />
    </WagmiConfig>
  );
}

export default App;
