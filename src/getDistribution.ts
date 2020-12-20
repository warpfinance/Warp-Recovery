const ObjectsToCsv = require('objects-to-csv')
const BigNumber = require('bignumber.js')

BigNumber.set({ DECIMAL_PLACES: 18, EXPONENTIAL_AT: 1e+9 })

//All user balances as of block 11487350, Dec 19 2020 0200 UTC
//USDC-DAI discrepancy at the time

const balancesSnapshot = require('../recovery/balances-11487350.json')
const usdcPerDAI = BigNumber("0.998")

//Total recovered UNI V2 collateral
//https://etherscan.io/token/0xa478c2975ab1ea89e8196811f51a7b7ade33eb11?a=0x13db1cb418573f4c3a2ea36486f0e421bc0d2427

const recoveredLP = BigNumber("94349.340516285530671934")

//Reduce snapshot to record of total USD stablecoin deposits per user
//Remove zero balances

function getStablecoinBalances() {
    const addresses = Object.keys(balancesSnapshot)
    return addresses.map(address => {
        const { scVaults } = balancesSnapshot[address]
        const USDC = BigNumber(scVaults.USDC.balance).times(usdcPerDAI)
        const DAI = BigNumber(scVaults.DAI.balance)
        const accountStablecoinValue = USDC.plus(DAI)
        return {
            address: address,
            balance: accountStablecoinValue
        }
    }).filter(deposit => deposit.balance > 0)
}

const deposits = getStablecoinBalances()

//Calculate total outstanding claim value
//Calculate proportional claims to recovered UNI V2

const totalClaims = deposits.map(deposit => deposit.balance).reduce((prevBal, nextBal) => prevBal.plus(nextBal))
const claims = deposits.map(deposit => {
    const proportionalShare = deposit.balance.times(recoveredLP).div(totalClaims)
    const decimalString = proportionalShare.toString()
    return { address: deposit.address, balance: decimalString }
})

//Write to CSV for processing by https://disperse.app

const distributionCSV = new ObjectsToCsv(claims).toDisk('../distribution-11487350-corrected.csv')