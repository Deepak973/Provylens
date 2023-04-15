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
import { alchemyProvider } from "wagmi/providers/alchemy";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import SupplierDashboard from "./pages/SupplierDashboard";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
import VerifyProduct from "./components/VerifyProduct";
import Profile from "./components/Profile";
// import TreeNode from "./components/Tree.js";
import { Chat } from "@pushprotocol/uiweb";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { useAccount } from "wagmi";
// import Tree from "./components/OrgChartTree.js";
import OrgChartTree from "./components/OrgChartTree.js";

function App() {
  // const address = useAccount();
  // const { address, isConnecting, isDisconnected } = useAccount();
  let address = "";

  const BTTChain = {
    id: 1029,
    name: "BitTorrent Chain Donau",
    network: "BitTorrent Chain Donau",
    iconUrl: "https://testscan.bt.io/static/media/BTT.e13a6c4e.svg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "BitTorrent Chain Donau",
      symbol: "BTT",
    },
    rpcUrls: {
      default: "https://pre-rpc.bittorrentchain.io/",
    },
    blockExplorers: {
      default: {
        name: "BitTorrent Chain Donau",
        url: "https://testscan.bt.io",
      },
    },
    testnet: true,
  };

  const { chains, provider } = configureChains(
    [BTTChain, polygonMumbai],
    [
      jsonRpcProvider({
        rpc: (chain) => ({ http: "https://pre-rpc.bittorrentchain.io/" }),
      }),
      alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
      // publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <div className="App">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="register" element={<Register />} />
              <Route
                path="/supplier-dashboard"
                element={<SupplierDashboard />}
              />
              <Route
                path="/manufacturer-dashboard"
                element={<ManufacturerDashboard />}
              />
              <Route
                path="/distributor-dashboard"
                element={<DistributorDashboard />}
              />
              <Route path="/extra" element={<OrgChartTree />} />
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/verify-product/:id?" element={<VerifyProduct />} />
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
      {/* <Chat
        account={address} //user address
        supportAddress="0xe57f4c84539a6414C4Cf48f135210e01c477EFE0" //support address
      /> */}
    </WagmiConfig>
  );
}

export default App;
