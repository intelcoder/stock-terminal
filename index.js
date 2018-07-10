const chalk = require('chalk')
const fetch = require('node-fetch')
const blessed = require('blessed')
const term = require( 'terminal-kit' ).terminal

const colSize = 12
const symbols = ['khc', 'teva', 'sogo', 'iq']

const fillWithSpace = (columnSize, remain) => {
  const length = String(remain).length
  return new Array(columnSize - length).fill(' ').join('')
}

const fetchQuote = async (symbol) => {
  const res = await fetch(`https://api.iextrading.com/1.0/stock/${symbol}/quote`)
  return res.json()
}
const printOnTerminal = (quote) => {
  term.bold('\n\nSymbol      Open        Current     Changed\n')
  term.bold.green('-------------------------------\n')
  term.bold.green(quote.symbol).bold(fillWithSpace(colSize, quote.symbol))
  term.bold(quote.open).bold(fillWithSpace(colSize, quote.open))

  if(quote.open > quote.latestPrice) {
    term.red(quote.latestPrice).bold(fillWithSpace(colSize, quote.latestPrice))
  } else {
    term.green(quote.latestPrice).bold(fillWithSpace(colSize, quote.latestPrice))
  }
  if(quote.changePercent > 0) {

    term.green(quote.changePercent).bold(fillWithSpace(colSize, (quote.changePercent * 100).toFixed(2)))
  } else {
    term.red(quote.changePercent).bold(fillWithSpace(colSize, (quote.changePercent * 100).toFixed(2)))
  }
}

(async () =>{
  for(let i = 0; i < symbols.length; i++) {
    const quote = await fetchQuote(symbols[i])
    printOnTerminal(quote)
  }
})()

setInterval(async () => {
  term.clear()
  for(let i = 0; i < symbols.length; i++) {
    const quote = await fetchQuote(symbols[i])
    printOnTerminal(quote)
  }
  // Promise.all(symbols.map(symbol => fetchQuote(symbol)))
}, 60 * 1000)

