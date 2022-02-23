import {createDeposit, sendDeposit, SherpaSDK, withdraw} from './sherpa'
import Web3 from "web3"
import {parseNote} from "./snark-functions";
import {actions, sortEventsByLeafIndex} from "./events";
require('dotenv').config()
jest.setTimeout(60000)
import 'isomorphic-fetch';
import {getters, state} from "./constants";
//inject fetch globally

/** trade config **/
const netId = 43113
const amount = 10
const currency = "avax"

/** test helpers **/
const testPrivKey = String(process.env.TEST_PRIVATE_KEY)
const providerUrl = String(process.env.PROVIDER_URL)
jest.spyOn(global, "Blob").mockImplementationOnce(() => ({ type: "text/plain;charset=utf-8" }));
const etherToWei = (x)=>x*1e18

/** web3 **/
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
const fromAddress = web3.eth.accounts.privateKeyToAccount(testPrivKey).address
console.log("from address is",fromAddress)
web3.eth.accounts.wallet.add(testPrivKey)

/** test setup **/
// const sherpaProxyAddress = getters.getSherpaProxyContract(state)(netId)//todo remove curry
const selectedContractAddress = getters.getNoteContractInfo({
  amount:etherToWei(amount),
  currency,
  netId
}).contractAddress

describe("sherpa", () => {
  describe("deposit",()=>{
    it("should return notestring and commitment", async () => {
      const sherpaSDK = new SherpaSDK(netId, web3)
      const deposit = sherpaSDK.createDeposit(10,"avax")
      const notePieces = deposit.noteString.split("-")
      expect(notePieces[0]).toEqual("sherpa")
      expect(notePieces[1]).toEqual("avax")
      expect(notePieces[2]).toEqual("10")
      expect(notePieces[3]).toEqual("43113")
      expect(notePieces[4].length).toEqual(126)
      expect(deposit.commitment.length).toEqual(66)
      console.log(deposit)
    });
    it("create and download",()=>{
      const sherpaSDK = new SherpaSDK(netId, web3)
      const deposit = sherpaSDK.createDeposit(10,"avax")
      const mockSaveAs = jest.fn()
      sherpaSDK.downloadNote(deposit.noteString, mockSaveAs)
      const [ blob, filename ] = mockSaveAs.mock.calls[0]
      expect(filename.startsWith("backup-sherpa-avax-10-")).toBeTruthy()
    })
    it("should create, download and send",async ()=>{
      const sherpaSDK = new SherpaSDK(netId, web3)
      sherpaSDK.fetchAndSaveCircuitAndProvingKey()
      const deposit = sherpaSDK.createDeposit(etherToWei(10),"avax")//create the unique key that will be used to withdraw
      console.log("deposit is",deposit)
      await sherpaSDK.downloadNote(deposit.noteString, jest.fn())//ensure the user has downloaded the unique key to a safe spot
      await sherpaSDK.sendDeposit(etherToWei(10), deposit.commitment,"avax",fromAddress)//send funds to the smart contract
    })
  })
  describe("withdraw",()=>{
    it("should withdraw funds",async ()=>{
      /**User supplied info **/
      const uniqueKey = "sherpa-avax-10000000000000000000-43113-0xf0b4ad335f3a0c3b666160a54ffe8d487e2f8fd708987415523ea1fb6d834e507236654f53ab38a634e3fa6b200893b705709c47203df8cc98f4d5e911cd"
      const commitment = "0x11ba1eb85ecbaf7c1c3ad7e6248bbfb7ef5cf8f68678a6d77162cb0e1080fc28"//this is encoded above
      const destinationAddress = "0x62b54b1f870484A338cF5c7b3323a546B0f6569d"
      const selfRelay = false
      /** get events from blockchain via graphql **/
      const events = await actions.getEventsSubgraph(state, selectedContractAddress, netId)
      const depositEvents = events.events.filter(e => e.type === 'Deposit').sort(sortEventsByLeafIndex);

      /**  **/
      //todo is this fetching the non fuji circuit and key - resulting in an undefined proof?
      const circuit = await (await fetch('https://app.sherpa.cash/withdraw.json')).json()
      const provingKey = await (await fetch('https://app.sherpa.cash/withdraw_proving_key.bin')).arrayBuffer()

      await withdraw(uniqueKey, destinationAddress, selfRelay, {depositEvents}, circuit, provingKey)
    })
  })

});