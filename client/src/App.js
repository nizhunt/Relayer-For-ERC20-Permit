import { useState, useEffect, useImperativeHandle } from "react";
import { BigNumber, ethers } from "ethers";
import Buy from "./components/Send";
import Memos from "./components/Memos";
import tokenABI from "./contracts/abi/TokenA.json";
import addresses from "./contracts/address.json";

function App() {
  const [haveMetamask, setHaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState("None");
  const [isConnected, setIsConnected] = useState(false);
  const [balances, setBalances] = useState({
    balanceA: BigNumber.from("0"),
    balanceB: BigNumber.from("0"),
  });

  const [state, setState] = useState({
    provider: null,
    signer: null,
  });

  const { ethereum } = window;

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        setHaveMetamask(false);
      }
      setHaveMetamask(true);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setState({ provider, signer });
    };

    if (isConnected) {
      ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }

    checkMetamaskAvailability();
  }, [isConnected]);

  const getTokenBalances = async () => {
    try {
      setInterval(async () => {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const tokenA = new ethers.Contract(
          addresses.TokenA,
          tokenABI,
          state.signer
        );

        const balanceA = await tokenA.balanceOf(accounts[0]);

        const tokenB = new ethers.Contract(
          addresses.TokenB,
          tokenABI,
          state.signer
        );
        const balanceB = await tokenB.balanceOf(accounts[0]);

        setBalances({ balanceA, balanceB });
      }, 3000);
    } catch (e) {
      alert(e);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        setHaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccountAddress(accounts[0]);

      getTokenBalances();

      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.log(error);
    }
  };

  return (
    <div style={{ backgroundColor: "#EFEFEF", height: "100%" }}>
      {haveMetamask ? (
        <div className="row d-flex justify-content-center py-4">
          <div className="col-lg-6 col-md-8">
            <p className="text-muted lead " style={{ marginLeft: "5px" }}>
              <small>Connected Account - {accountAddress}</small>
              <br></br>
              <small>Token A Address - {addresses.TokenA}</small>
              <br></br>
              <small>
                Balance - {ethers.utils.formatEther(balances.balanceA)}
              </small>
              <br></br>
              <small>Token B Address - {addresses.TokenB}</small>
              <br></br>
              <small>
                Balance - {ethers.utils.formatEther(balances.balanceB)}
              </small>
            </p>
          </div>
          {isConnected ? (
            <div className="col-lg-1 col-md-1 ">
              <button className="btn btn-primary " disabled>
                Connected
              </button>
            </div>
          ) : (
            <div className="col-lg-1 col-md-1 ">
              <button className="btn btn-primary " onClick={connectWallet}>
                ConnectWallet
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Please Install MataMask</p>
        </div>
      )}

      <div className="container">
        <div>
          <div>
            <Buy state={state} isConnected={isConnected} />
          </div>
        </div>

        <Memos
          state={state}
          getTokenBalances={getTokenBalances}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}

export default App;
