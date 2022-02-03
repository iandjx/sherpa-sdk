import {createDeposit, sendDeposit, state, withdraw} from './sherpa'
import Web3 from "web3"
import {parseNote} from "./snark-functions";
import {actions, sortEventsByLeafIndex} from "./events";
require('dotenv').config()
jest.setTimeout(60000)

const testPrivKey = process.env.TEST_PRIVATE_KEY
const providerUrl = process.env.PROVIDER_URL
const netId = 43113
const web3Provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(web3Provider);
const fromAddress = web3.eth.accounts.privateKeyToAccount(testPrivKey).address
web3.eth.accounts.wallet.add(testPrivKey)
const sherpaProxyAddress = "0xC0EB087ac8C732AC23c52A16627c4539d8966d79"//fuji
const selectedContractAddress = "0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f"//fuji 10avax
const sherpaState = state()

const weiToEther = (x)=>x*1e18

describe("sherpa", () => {
  describe("deposit",()=>{
  //   describe("createDeposit",()=>{
  //     it("should return notestring and commitment", async () => {
  //       const deposit = await createDeposit(10,"avax",netId)
  //       const notePieces = deposit.noteString.split("-")
  //       expect(notePieces[0]).toEqual("sherpa")
  //       expect(notePieces[1]).toEqual("avax")
  //       expect(notePieces[2]).toEqual("10")
  //       expect(notePieces[3]).toEqual("43113")
  //       expect(notePieces[4].length).toEqual(126)
  //       expect(deposit.commitment.length).toEqual(66)
  //       // console.log(deposit.commitment)
  //     });
  //   })
  //   describe("download",()=>{
  //     //todo
  //   })
  //   describe("sendDeposit",()=>{
  //     it("should make a TX", async ()=>{
  //       const commitment = "0x1c62bdc385222e1fbe795ea24771faa278a5d680270042d8a322374cb144884a"
  //       await sendDeposit(web3,10, sherpaProxyAddress, netId, selectedContractAddress, commitment,"avax",fromAddress)
  //     })
  // })
  //   it("should create, download and send",async ()=>{
  //     const deposit = await createDeposit(weiToEther(10),"avax",netId)
  //     console.log("withdrawl info within",deposit)//todo add download step
  //     const commitment = deposit.commitment
  //     await sendDeposit(web3,weiToEther(10), sherpaProxyAddress, netId, selectedContractAddress, commitment,"avax",fromAddress)
  //   })
  })
  describe("withdraw",()=>{
    // it("should get events",async ()=>{
    //
    //   const events = await actions.getEventsSubgraph(sherpaState, selectedContractAddress, netId)
    //   console.log(events)
    // })
    it("should withdraw funds",async ()=>{
      /**User supplied info **/
      const uniqueKey = "sherpa-avax-10000000000000000000-43113-0xf0b4ad335f3a0c3b666160a54ffe8d487e2f8fd708987415523ea1fb6d834e507236654f53ab38a634e3fa6b200893b705709c47203df8cc98f4d5e911cd"
      const commitment = "0x11ba1eb85ecbaf7c1c3ad7e6248bbfb7ef5cf8f68678a6d77162cb0e1080fc28"//this is encoded above
      const destinationAddress = "0x62b54b1f870484A338cF5c7b3323a546B0f6569d"
      const selfRelay = false
      /** **/
      // const parsedNote = parseNote(uniqueKey)
      // console.log(parsedNote)
      const events = await actions.getEventsSubgraph(sherpaState, selectedContractAddress, netId)
      const depositEvents = events.events.filter(e => e.type === 'Deposit').sort(sortEventsByLeafIndex);


      // const withdrawNote = {
      //   netId,
      //   amount:"todo",//weiToEther(10)?
      //   curreny:"todo",//avax?
      //   deposit:{
      //     nullifierHash:"todo",//todo snarks createDeposit can get nullifier hash?
      //     nullifier:"todo",
      //     secret:"todo",
      //     commitment//todo is this an output from snark's createDeposit or what is given to user?
      //   }
      // }
      await withdraw(uniqueKey, destinationAddress, selfRelay, netId, web3, {depositEvents})
    })
  })

});