import {
    toHex,
    getNoteStringAndCommitment,
    parseNote,
    generateProofSherpa
  } from "snark-functions";

export const actions = {
    async createDeposit({ state, commit, getters }, { amount, token }) {
      const { noteString, commitment } = getNoteStringAndCommitment(
        token,
        amount,
        this.$config.chainId
      );
      commit("setNoteString", noteString);
      commit("setCommitment", commitment);
    },
    async downloadNote({ state, commit, getters }){
      let blob = new Blob([getters.getNoteString], {
        type: "text/plain;charset=utf-8"
      });
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
  
      await saveAs(
        blob,
        `backup-sherpa-${getters.getSelectedToken}-${getters.getSelectedAmount}-${timestamp}.txt`
      );
    },
    async sendDeposit({ state, commit, getters, rootState }, buefy) {
      let web3 = this.$manager.web3;
  
      let amount = getters.getSelectedAmount;
      let value = getters.getSelectedValue;
  
      let sherpaProxyContractAddress = getters.getSherpaProxyContract;
      console.log($nuxt.$config.chainId)
      console.log(web3.eth.getChainId())
      assert($nuxt.$config.chainId === await web3.eth.getChainId(), "Your wallet is not configured to the correct network.")
  
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
  
    },
    async withdraw({ dispatch, state, commit, getters, rootGetters, rootState }) {
      let web3;
      const parsedNote = parseNote(state.withdrawNote);
      const addressRegex = /^0x[a-fA-F0-9]{40}/g
      const match = addressRegex.exec(state.withdrawAddress)
  
      if (!match) {
        throw new Error("The address has invalid format")
      }
  
      if(state.relayerMode) {
        const id = $nuxt.$config.chainId;
        const network = { ...networkConfig[`chainId${id}`], id: Number(id) };
        web3 = new Web3(network.rpcUrls.Figment.url);
      } else {
        web3 = this.$manager.web3;
        assert(parsedNote.netId === await web3.eth.getChainId(), "Your wallet is not configured to the correct network.")
      }
      // console.log("parsedNote", parsedNote);
      // console.log("hex commitment", toHex(parsedNote.deposit.commitment));
      const contractInfo = getters.getNoteContractInfo(parsedNote);
      await dispatch("events/getEventsSubgraph", contractInfo.contractAddress, { root: true });
      dispatch('loading/enable', {message: 'Generating proof', description: $nuxt.$i18n.t('pages.vault.generateProof')}, {root: true})
      let sherpaProxyContractAddress = getters.getSherpaProxyContract;
      const pitContract = new web3.eth.Contract(
        sherpaProxyABI,
        sherpaProxyContractAddress
      );
  
      const sherpaContract = new web3.eth.Contract(
        ethSherpaABI,
        contractInfo.contractAddress
      );
  
      const relayer = rootGetters["relayers/getSelectedRelayer"]
      const relayerFee = BigInt(relayer.status.tornadoServiceFee*10000).mul(BigInt(contractInfo.value)).div(BigInt(1000000))
      const gas = BigInt(225*350000)
      let totalFee = relayerFee.add(gas)
      let rewardAccount = relayer.status.rewardAccount
      let refundAmount = 0 //parsedNote.amount * (10**18)
      if(!state.relayerMode){
        totalFee = 0
        rewardAccount = 0
        refundAmount = 0
      }
      assert(parsedNote.netId === relayer.chainId || parsedNote.netId === '*', 'This relayer is for a different network')
      const { proof, args } = await generateProofSherpa(sherpaContract, parsedNote.deposit, state.withdrawAddress, rootState.events.depositEvents, rewardAccount, totalFee, refundAmount)
      const requestBody = {
        proof: proof,
        contract: contractInfo.contractAddress,
        args: [args[0], args[1], args[2], args[3], args[4], args[5]]
      }
      dispatch('loading/enable', {message: $nuxt.$i18n.t('pages.vault.withdraw')}, {root: true})
  
      if(!state.relayerMode){
        await pitContract.methods.withdraw(state.selectedContract, proof, ...args).send({
          from: state.withdrawAddress
        });
      }
  
  
      if(state.relayerMode){
        const response = await this.$axios.$post(
          rootGetters["relayers/getSelectedRelayer"].url +'/v1/tornadoWithdraw', requestBody
        );
      }
  
      dispatch('loading/disable', null, {root: true})
  
  
  
  
    },
}