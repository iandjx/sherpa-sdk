import {
  toHex,
  getNoteStringAndCommitment,
  parseNote,
  generateProofSherpa,
} from "./snark-functions";
import networkConfig from "./networkConfig";
import { state, getters, sherpaProxyABI, ethSherpaABI } from "./constants";
import { actions, sortEventsByLeafIndex } from "./events";

export class SherpaSDK {
  constructor(chainId, web3) {
    this.chainId = chainId;
    this.web3 = web3;
  }

  //todo
  async fetchCircuitAndProvingKey() {
    //todo promise.all
    const circuit = await (await fetch("/withdraw.json")).json();
    const provingKey = await (
      await fetch("/withdraw_proving_key.bin")
    ).arrayBuffer();
    this.circuit = circuit;
    this.provingKey = provingKey;
  }

  async fetchEvents(valueWei, selectedToken) {
    const selectedContractAddress = getters.getNoteContractInfo({
      amount: Number(valueWei),
      currency: selectedToken,
      netId: this.chainId,
    }).contractAddress;
    const events = await actions.getEventsSubgraph(
      state,
      selectedContractAddress,
      this.chainId
    );
    this.events = events;
    return events;
  }

  createDeposit(amount, token) {
    const { noteString, commitment } = getNoteStringAndCommitment(
      token,
      amount,
      this.chainId
    );
    return {
      noteString,
      commitment,
    };
  }
  getRelayerList() {
    getters.getRelayersList(this.chainId);
  }
  async downloadNote(noteString, saveAs) {
    let blob = new Blob(noteString, {
      type: "text/plain;charset=utf-8",
    });
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const [protocol, token, amount] = noteString.split("-");
    const filename = `backup-${[protocol, token, amount, timestamp].join(
      "-"
    )}.txt`;

    await saveAs(blob, filename);
  }

  async getCompliance(uniqueKey) {
    const { /**nullifierHash,**/ commitmentHex, nullifierHex } =
      parseNote(uniqueKey).deposit;
    const [_, selectedToken, valueWei] = uniqueKey.split("-");
    await this.fetchEvents(valueWei, selectedToken);
    const compliance = { deposit: null, withdrawl: null };
    const depositEvent = this.events.events.find(
      (e) => e.commitment == commitmentHex
    );
    compliance.deposit = {
      transaction: depositEvent?.txHash,
      address: "0x12345", //todo make blockchain call
      id: commitmentHex,
    };
    const withdrawlEvent = this.events.events.find(
      (e) => e.nullifierHash == nullifierHex
    );
    compliance.withdrawl = {
      transaction: withdrawlEvent?.txHash,
      address: withdrawlEvent?.to,
      id: nullifierHex,
    };
    return compliance;
  }

  async sendDeposit(valueWei, commitment, selectedToken, fromAddress) {
    const sherpaProxyAddress = getters.getSherpaProxyContract(this.netId);
    const selectedContractAddress = getters.getNoteContractInfo({
      amount: Number(valueWei),
      currency: selectedToken,
      netId: this.chainId,
    }).contractAddress;
    let pitContract = new this.web3.eth.Contract(
      sherpaProxyABI,
      sherpaProxyAddress
    );
    await pitContract.methods
      .deposit(selectedContractAddress, toHex(commitment), 0)
      .send({
        value: selectedToken === "avax" ? valueWei : 0,
        from: fromAddress,
        gas: 2100000,
      });
  }
  async withdraw(withdrawNote, withdrawAddress, relayerMode, selectedRelayer) {
    if (!this.events || !this.circuit || !this.provingKey) {
      throw new Error(
        "Sherpa SDK not initialized with events or circuir/proving key"
      );
    }
    // let web3;
    const parsedNote = parseNote(withdrawNote);
    const addressRegex = /^0x[a-fA-F0-9]{40}/g;
    const match = addressRegex.exec(withdrawAddress);

    if (!match) {
      throw new Error("The address has invalid format");
    }

    if (relayerMode) {
      const id = this.chainId;
      const network = { ...networkConfig[`chainId${id}`], id: Number(id) };
      // web3 = new Web3(network.rpcUrls.Figment.url);//todo Figment? - maybe move this logic to calling function?
    } else {
      // web3 = this.$manager.web3;
      // assert(parsedNote.netId === await web3.eth.getChainId(), "Your wallet is not configured to the correct network.")//todo redo
    }
    // console.log("parsedNote", parsedNote);
    // console.log("hex commitment", toHex(parsedNote.deposit.commitment));
    const contractInfo = getters.getNoteContractInfo(parsedNote);
    let sherpaProxyContractAddress = getters.getSherpaProxyContract(
      this.chainId
    );
    const pitContract = new this.web3.eth.Contract(
      sherpaProxyABI,
      sherpaProxyContractAddress
    );

    const sherpaContract = new this.web3.eth.Contract(
      ethSherpaABI,
      contractInfo.contractAddress
    );

    const relayer = selectedRelayer; //todo getters.getSelectedRelayer(state);
    const relayerFee = BigInt(0); //todo BigInt(relayer.status.tornadoServiceFee*10000).mul(BigInt(contractInfo.value)).div(BigInt(1000000))
    const gas = BigInt(225 * 350000);
    let totalFee = relayerFee.add(gas);
    let rewardAccount = 0; //todo relayer.status.rewardAccount//todo currently undefined - but we are not using a relayer for now
    let refundAmount = 0; //parsedNote.amount * (10**18)
    if (relayerMode) {
      totalFee = 0;
      rewardAccount = 0;
      refundAmount = 0;
    }
    const depositEvents = this.events.events
      .filter((e) => e.type === "Deposit")
      .sort(sortEventsByLeafIndex);
    // console.log("xxx",{sherpaContract, deposit:parsedNote.deposit, withdrawAddress, depositEvents, circuit:this.circuit, provingKey:this.provingKey, rewardAccount, totalFee, refundAmount})
    // assert(parsedNote.netId === relayer.chainId || parsedNote.netId === '*', 'This relayer is for a different network')
    const { proof, args } = await generateProofSherpa(
      sherpaContract,
      parsedNote.deposit,
      withdrawAddress,
      depositEvents,
      this.circuit,
      this.provingKey,
      rewardAccount,
      totalFee,
      refundAmount
    );
    const requestBody = {
      proof: proof,
      contract: contractInfo.contractAddress,
      args: [args[0], args[1], args[2], args[3], args[4], args[5]],
    };

    // if(!relayerMode){
    //   await pitContract.methods.withdraw(contractInfo.contractAddress, proof, ...args).send({
    //     from: withdrawAddress,
    //     gas: 1000000
    //   });
    // }

    if (relayerMode) {
      // const response = await this.$axios.$post(//todo fix
      //   relayer.url +'/v1/tornadoWithdraw', requestBody
      // );
    }
  }
}
