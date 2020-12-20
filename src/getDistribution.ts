const ObjectsToCsv = require('objects-to-csv')

const BigNumber = require('bignumber.js')
BigNumber.set({ DECIMAL_PLACES: 18 })

const data = require('../balances.json')
const recoveredLP = BigNumber("94349.340516316098209148")

function getStablecoinBalances() {
    const addresses = Object.keys(data)
    return addresses.map(address => {
        const { scVaults } = data[address]
        const USDC = BigNumber(scVaults.USDC.balance)
        const DAI = BigNumber(scVaults.DAI.balance)
        const accountStablecoinValue = USDC.plus(DAI)
        return {
            address: address,
            balance: accountStablecoinValue
        }
    }).filter(deposit => deposit.balance > 0)
}

const accounts = getStablecoinBalances()
const totalIOU = accounts.map(account => account.balance).reduce((prevBal, nextBal) => prevBal.plus(nextBal))
const IOUs = accounts.map(account => {
    const proportionalShare = account.balance.times(recoveredLP).div(totalIOU)
    const decimalString = proportionalShare.toString()
    return { address: account.address, balance: decimalString }
})

const distributionCSV = new ObjectsToCsv(IOUs).toDisk('../distribution.csv')