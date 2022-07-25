export const changeChainId = async (provider: any, chainId: string) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }]
      });
      return true;
    } catch (err) {
      console.log(err);
      if (err instanceof Error && err.message.includes("Unrecognized chain ID")) {
        const networkMap = {
          POLYGON_MAINNET: {
            chainId: '0x4',
            chainName: "Rinkeby",
            nativeCurrency: { name: "Rinkeby", symbol: "RinkebyETH", decimals: 18 },
            rpcUrls: ["https://rinkeby.infura.io/v3/"],
            blockExplorerUrls: ["https://rinkeby.etherscan.io"],
          }
        }
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [networkMap.POLYGON_MAINNET],
        });
      } else {  
        return false;
      }
    }
  };
  