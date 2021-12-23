const networkConfig = {
    chainId43114: {
      currencyName: 'AVAX',
      networkName: 'Mainnet',
      rpcUrls: {
        Main: {
          name: 'Main',
          url: 'https://api.avax.network/ext/bc/C/rpc',
        },
      },
      subgraph: 'https://api.thegraph.com/subgraphs/name/sherpa-cash/sherpa'
    },
    chainId43113: {
      currencyName: 'AVAX',
      networkName: 'Fuji',
      rpcUrls: {
        Main: {
          name: 'Main',
          url: 'https://api.avax-test.network/ext/bc/C/rpc',
        },
      },
      subgraph: 'https://api.thegraph.com/subgraphs/name/sherpa-cash/sherpa-fuji'
    },
  }
  
  export default networkConfig
  