const chalk = require('chalk')
const fetch = require('node-fetch')
const blessed = require('blessed')
const term = require( 'terminal-kit' ).terminal

const colSize = 12
const symbols = ['fb', 'aapl','stz', 'baba', 'teva']

const fillWithSpace = (columnSize, remain) => {
  const length = String(remain).length
  return new Array(columnSize - length).fill(' ').join('')
}

const fetchQuote = async (symbol) => {
  const res = await fetch(`https://api.iextrading.com/1.0/stock/${symbol}/quote`)
  return res.json()
}
const printOnTerminal = (quote) => {
  term.bold.green(quote.symbol).bold(fillWithSpace(colSize, quote.symbol))
  term.bold(quote.open).bold(fillWithSpace(colSize, quote.open))

  if(quote.open > quote.latestPrice) {
    term.red(quote.latestPrice).bold(fillWithSpace(colSize, quote.latestPrice))
  } else {
    term.green(quote.latestPrice).bold(fillWithSpace(colSize, quote.latestPrice))
  }
  const changedPercentage = (quote.changePercent * 100).toFixed(2)
  if(quote.changePercent > 0 && quote.open < quote.latestPrice) {
    term.green(changedPercentage + '% ').bold(fillWithSpace(colSize, changedPercentage))
  } else {
    term.red(changedPercentage + '% ').bold(fillWithSpace(colSize, changedPercentage))
  }
  term('\n')
}

const getQuotes = async () => {
  const quotes = []
  for(let i = 0; i < symbols.length; i++) {
    const quote = await fetchQuote(symbols[i])
    quotes.push(quote)
  }
  return quotes
}
const showResult = async () => {
  const quotes = await getQuotes()
  term.bold('Symbol      Open        Current     Changed\n')
  term.bold.green('-------------------------------\n')
  quotes.forEach(quote => printOnTerminal(quote))
}

showResult()
setInterval(async () => {
  showResult()
}, 5000)

