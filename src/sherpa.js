import {
    toHex,
    getNoteStringAndCommitment,
    parseNote,
    generateProofSherpa
  } from "snark-functions";
import { networkConfig } from "networkConfig";

export const state = () => {
  return {
    tokens: [
      {
        id: 1,
        slug: "avax",
        label: "AVAX",
        address: null,
        decimals: 18,
        chainId: 43114
      },
      {
        id: 2,
        slug: "avax",
        label: "AVAX",
        address: null,
        decimals: 18,
        chainId: 43113
      },
      {
        id: 3,
        slug: "tsd",
        label: "TSD",
        address: "0x4fbf0429599460D327BD5F55625E30E4fC066095",
        decimals: 18,
        chainId: 43114
      },
      {
        id: 4,
        slug: "tsd",
        label: "TSD",
        address: "0xc92bd11e6ecc0a4faf9c8bb5395ebb617d7e6698",
        decimals: 18,
        chainId: 43113
      },
      {
        id: 5,
        slug: "elk",
        label: "ELK",
        address: "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C",
        decimals: 18,
        chainId: 43114
      },
    ],
    contracts: [
      {
        label: "10",
        contractAddress: "0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f",
        contractDomain: "avax-10.sherpa.avax",
        token: "avax",
        allowance: Number.MAX_SAFE_INTEGER,
        value: 10000000000000000000,
        chainId: 43113
      },
      {
        label: "100",
        contractAddress: "0x9B247a159a0bB483098620656ADf8Bcac1365A1f",
        contractDomain: "avax-100.sherpa.avax",
        token: "avax",
        allowance: Number.MAX_SAFE_INTEGER,
        value: 100000000000000000000,
        chainId: 43113
      },
      {
        label: "500",
        contractAddress: "0x345aeAbf09Bc4Ee603af672d2De925483c35A5b0",
        contractDomain: "avax-500.sherpa.avax",
        token: "avax",
        allowance: Number.MAX_SAFE_INTEGER,
        value: 500000000000000000000,
        chainId: 43113
      },
      {
        label: "10",
        contractAddress: "0xe1376DeF383D1656f5a40B6ba31F8C035BFc26Aa",
        contractDomain: "avax-10.sherpa.avax",
        token: "avax",
        allowance: Number.MAX_SAFE_INTEGER,
        value: 10000000000000000000,
        chainId: 43114
      },
      {
        label: "100",
        contractAddress: "0x7CE57f6a5a135eb1a8e9640Af1eff9665ade00D9",
        contractDomain: "avax-100.sherpa.avax",
        token: "avax",
        allowance: Number.MAX_SAFE_INTEGER,
        value: 100000000000000000000,
        chainId: 43114
      },
      {
        label: "500",
        contractAddress: "0x6ceB170e3ec0fAfaE3Be5A02FEFb81F524FE85C5",
        contractDomain: "avax-500.sherpa.avax",
        token: "avax",
        allowance: Number.MAX_SAFE_INTEGER,
        value: 500000000000000000000,
        chainId: 43114
      },
      {
        label: "100",
        contractAddress: "0xBA00d4B0A8E9A63c3c5788908c8a93A242d26e51",
        contractDomain: "tsd-100.sherpa.avax",
        token: "tsd",
        allowance: null,
        value: 100000000000000000000,
        chainId: 43113
      },
      {
        label: "1000",
        contractAddress: "0x4F3c2d6B74b387936b25916b81348881F09c8bdf",
        contractDomain: "tsd-1000.sherpa.avax",
        token: "tsd",
        allowance: null,
        value: 1000000000000000000000,
        chainId: 43113
      },
      {
        label: "10000",
        contractAddress: "0x7409642215b43F7DDAb528004D9ae9A414190A45",
        contractDomain: "tsd-10000.sherpa.avax",
        token: "tsd",
        allowance: null,
        value: 10000000000000000000000,
        chainId: 43113
      },
      {
        label: "100",
        contractAddress: "0x0B50666bA2fE78c025ccEB014F9622eB769bee94",
        contractDomain: "tsd-100.sherpa.avax",
        token: "tsd",
        allowance: null,
        value: 100000000000000000000,
        chainId: 43114
      },
      {
        label: "1000",
        contractAddress: "0xeeE270f3F38D135Ea9Bda18fDDC205a253D02c50",
        contractDomain: "tsd-1000.sherpa.avax",
        token: "tsd",
        allowance: null,
        value: 1000000000000000000000,
        chainId: 43114
      },
      {
        label: "10000",
        contractAddress: "0x762cbdC98e64F3ABf2741AfB3781e5cBDA4DD783",
        contractDomain: "tsd-10000.sherpa.avax",
        token: "tsd",
        allowance: null,
        value: 10000000000000000000000,
        chainId: 43114
      },
      {
        label: "25",
        contractAddress: "0xbc3c7BD7328c35b2fFaD20F5899ef2581D2d2ec4",
        contractDomain: "elk-25.sherpa.avax",
        token: "elk",
        allowance: null,
        value: 25000000000000000000,
        chainId: 43114
      },
      {
        label: "250",
        contractAddress: "0x56Ac03CE9a3BEb17FD84ECef6d4D8de4070e601D",
        contractDomain: "elk-250.sherpa.avax",
        token: "elk",
        allowance: null,
        value: 250000000000000000000,
        chainId: 43114
      },
      {
        label: "500",
        contractAddress: "0x238F453A08C7A136603D40E092F150D5B35e62E2",
        contractDomain: "elk-500.sherpa.avax",
        token: "elk",
        allowance: null,
        value: 500000000000000000000,
        chainId: 43114
      },
    ],
    selectedContract: "0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f",
    currentNote: null,
    currentCommitment: null,
    selectedToken: "avax",
    deposit: null,
    enabled: false,
    txHash: null,
    selectedView: "deposit",
    withdrawNote: null,
    withdrawNoteToken: null,
    withdrawAddress: null,
    complianceInfo: null,
    sherpaProxyContract:
      {
        fuji: "0xC0EB087ac8C732AC23c52A16627c4539d8966d79",
        mainnet: "0x171Fb28ebfFcb2737E530E1Fd48CB4Ef12E5031e"
      },
    relayerMode: true,
    relayersList: [
      {
        id: 1,
        url: "https://relayer.sherpa.entropygra.ph",
        name: 'Sherpa Relayer',
        chainId: 43114,
        fee: 1,
        status: {}
      },
      {
        id: 2,
        url: "https://relayer-fuji.sherpa.entropygra.ph",
        name: 'Sherpa Fuji Relayer',
        chainId: 43113,
        fee: 1,
        status: {}
      },
      {
        id: 3,
        url: "http://localhost:8000",
        name: 'Local Test Relayer',
        chainId: 43114,
        fee: 0.10,
        status: {}
      },
      {
        id: 4,
        url: "http://localhost:8000",
        name: 'Local Test Relayer',
        chainId: 43113,
        fee: 0.10,
        status: {}
      }
    ],
    selectedRelayerId: 1
  };
};

export const getters = {
  getTokens: state => {
    return state.tokens;
  },
  getContracts: state => {
    return state.tokens;
  },
  getSelectedToken: state => {
    return state.selectedToken;
  },
  getSelectedContract: state => {
    return state.selectedContract;
  },
  getSelectedAmount: state => {
    let noteAmount = state.contracts.filter(contract => {
      return contract.contractAddress == state.selectedContract;
    })[0].label;
    return noteAmount;
  },
  getSelectedValue: state => {
    let value = state.contracts.filter(contract => {
      return contract.contractAddress == state.selectedContract;
    })[0].value;
    return value;
  },
  getWithdrawNote: state => {
    return state.withdrawNote;
  },
  getWithdrawNoteToken: state => {
    return state.withdrawNoteToken;
  },
  getNoteString(state) {
    return state.currentNote;
  },
  getWithdrawAddress: state => {
    return state.withdrawAddress;
  },
  getNoteContractInfo: state => parsedNote => {
    return state.contracts.filter(contract => {
      return (
        contract.label === parsedNote.amount &&
        contract.token === parsedNote.currency &&
        contract.chainId === parsedNote.netId
      );
    })[0];
  },
  getSelectedContractInfo: state => {
    return state.contracts.filter(contract => {
      return state.selectedContract === contract.contractAddress;
    })[0];
  },
  getSherpaProxyContract: state => {
    return ($nuxt.$config.chainId == 43114)
      ? state.sherpaProxyContract.mainnet : state.sherpaProxyContract.fuji
  },
  getSelectedRelayer: state => {
    return state.relayersList.find(relayer => relayer.id === state.selectedRelayerId);
  },
  getRelayersList: state => {
    return state.relayersList.filter(relayer => relayer.chainId === $nuxt.$config.chainId);
  },
};

export const mutations = {
  setSelectedToken(state, tokenSlug) {
    state.selectedToken = tokenSlug;
  },
  setSelectedContract(state, contractAddress) {
    state.selectedContract = contractAddress;
  },
  setNoteString(state, noteString) {
    state.currentNote = noteString;
  },
  setCommitment(state, commitment) {
    state.currentCommitment = commitment;
  },
  setSelectedView(state, newView) {
    state.selectedView = newView;
  },
  setWithdrawNote(state, noteString) {
    state.withdrawNote = noteString;
    state.withdrawNoteToken = parseNote(noteString).currency;
    if (state.withdrawNoteToken != 'avax') {
      state.relayerMode = false;
    }
  },
  setWithdrawAddress(state, address) {
    state.withdrawAddress = address;
  },
  setComplianceInfo(state, complianceInfo) {
    state.complianceInfo = complianceInfo;
  },
  setAllowance(state, { contractAddress, allowance }) {
    state.contracts.find(contract => contract.contractAddress === contractAddress).allowance = allowance;
  },
  setRelayerMode(state, value){
    console.log("relayer is set to ", value)
    state.relayerMode = value
  }
};

export async function createDeposit(amount, token, chainId) {
  const { noteString, commitment } = getNoteStringAndCommitment(
    token,
    amount,
    chainId
  );
  return {
    noteString,
    commitment
  }
}

export async function downloadNote(noteString){
  let blob = new Blob(noteString, {
    type: "text/plain;charset=utf-8"
  });
  const currentDate = new Date();
  const timestamp = currentDate.getTime();

  await saveAs(
    blob,
    `backup-sherpa-${getters.getSelectedToken}-${getters.getSelectedAmount}-${timestamp}.txt`
  );
}

export async function sendDeposit(amount, value, sherpaProxyContract, chainId) {
  let web3 = this.$manager.web3;

  let amount = amount;
  let value = value;

  let sherpaProxyContractAddress = sherpaProxyContract;

  let pitContract = new web3.eth.Contract(
    sherpaProxyABI,
    sherpaProxyContractAddress
  );
  await pitContract.methods.deposit(
    state.selectedContract,
    toHex(state.currentCommitment),
    0)
    .send({
    value: state.selectedToken === "avax" ? value : 0,
    from: rootState.account.address
    //gas: 210000
  });

}

export async function withdraw(withdrawNote, withdrawAddress, relayerMode, chainId) {
  let web3;
  const parsedNote = parseNote(withdrawNote);
  const addressRegex = /^0x[a-fA-F0-9]{40}/g
  const match = addressRegex.exec(withdrawAddress)

  if (!match) {
    throw new Error("The address has invalid format")
  }

  if(relayerMode) {
    const id = chainId;
    const network = { ...networkConfig[`chainId${id}`], id: Number(id) };
    web3 = new Web3(network.rpcUrls.Figment.url);
  } else {
    web3 = this.$manager.web3;
    assert(parsedNote.netId === await web3.eth.getChainId(), "Your wallet is not configured to the correct network.")
  }
  // console.log("parsedNote", parsedNote);
  // console.log("hex commitment", toHex(parsedNote.deposit.commitment));
  const contractInfo = getters.getNoteContractInfo(parsedNote);
  let sherpaProxyContractAddress = getters.getSherpaProxyContract;
  const pitContract = new web3.eth.Contract(
    sherpaProxyABI,
    sherpaProxyContractAddress
  );

  const sherpaContract = new web3.eth.Contract(
    ethSherpaABI,
    contractInfo.contractAddress
  );

  const relayer = getters.getSelectedRelayer;
  const relayerFee = BigInt(relayer.status.tornadoServiceFee*10000).mul(BigInt(contractInfo.value)).div(BigInt(1000000))
  const gas = BigInt(225*350000)
  let totalFee = relayerFee.add(gas)
  let rewardAccount = relayer.status.rewardAccount
  let refundAmount = 0 //parsedNote.amount * (10**18)
  if(relayerMode){
    totalFee = 0
    rewardAccount = 0
    refundAmount = 0
  }
  assert(parsedNote.netId === relayer.chainId || parsedNote.netId === '*', 'This relayer is for a different network')
  const { proof, args } = await generateProofSherpa(sherpaContract, parsedNote.deposit, withdrawAddress, events.depositEvents, rewardAccount, totalFee, refundAmount)
  const requestBody = {
    proof: proof,
    contract: contractInfo.contractAddress,
    args: [args[0], args[1], args[2], args[3], args[4], args[5]]
  }

  if(!relayerMode){
    await pitContract.methods.withdraw(contractInfo.contractAddress, proof, ...args).send({
      from: withdrawAddress
    });
  }


  if(relayerMode){
    const response = await this.$axios.$post(
      relayer.url +'/v1/tornadoWithdraw', requestBody
    );
  }
}