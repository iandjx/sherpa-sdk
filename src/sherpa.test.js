import  {createDeposit, sendDeposit } from './sherpa'
import Web3 from "web3"
require('dotenv').config()
jest.setTimeout(60000)

const testPrivKey = process.env.TEST_PRIVATE_KEY
const providerUrl = process.env.PROVIDER_URL
const web3Provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(web3Provider);
const fromAddress = web3.eth.accounts.privateKeyToAccount(testPrivKey).address
web3.eth.accounts.wallet.add(testPrivKey)
const sherpaProxyAddress = "0xC0EB087ac8C732AC23c52A16627c4539d8966d79"//fuji
const selectedContractAddress = "0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f"//fuji 10avax

const weiToEther = (x)=>x*1e18

describe("sherpa", () => {
  describe("deposit",()=>{
  //   describe("createDeposit",()=>{
  //     it("should return notestring and commitment", async () => {
  //       const deposit = await createDeposit(10,"avax",43114)
  //       const notePieces = deposit.noteString.split("-")
  //       expect(notePieces[0]).toEqual("sherpa")
  //       expect(notePieces[1]).toEqual("avax")
  //       expect(notePieces[2]).toEqual("10")
  //       expect(notePieces[3]).toEqual("43114")
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
  //       await sendDeposit(web3,10, sherpaProxyAddress, 43113, selectedContractAddress, commitment,"avax",fromAddress)
  //     })
  // })
    it("should create, download and send",async ()=>{
      const deposit = await createDeposit(weiToEther(10),"avax",43113)
      console.log("withdrawl info within",deposit)//todo add download step
      const commitment = deposit.commitment
      await sendDeposit(web3,weiToEther(10), sherpaProxyAddress, 43113, selectedContractAddress, commitment,"avax",fromAddress)
    })
  })

});