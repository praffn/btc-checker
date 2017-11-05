!function() {

  const VERSION = '0.0.1';
  const KEY = `PRAFFN_BTC_CHECKER_${VERSION}`;



  const btcElement = document.querySelector('[js-btc]');
  const fiatElement = document.querySelector('[js-fiat]');
  const fiatSymbolElement = document.querySelector('[js-fiat-symbol]');

  const fiat = JSON.parse(window.localStorage.getItem(`${KEY}-fiat`));
  let selectedFiat = fiat
    ? fiat.code
    : 'USD';
  let selectedFiatSymbol = fiat
    ? fiat.symbol
    : '$';

  const editButton = document.querySelector('[js-action="edit"]');
  const fiatSelector = document.querySelector('[js-action="fiat"]');

  let btc = 0.0;

  boot();

  function getBPIUrl(currency) {
    return `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`;
  }

  function boot() {
    // get btc
    btc = parseFloat(window.localStorage.getItem(`${KEY}-amount`));
    if (isNaN(btc)) {
      btc = 0.0;
    }

    editButton.addEventListener('click', editBTC);
    fiatSelector.addEventListener('change', selectFiat);
    setBTC(btc);
  }

  function saveBTC(amount) {
    window.localStorage.setItem(`${KEY}-amount`, amount);
  }

  function saveFiat() {
    const obj = { code: selectedFiat, symbol: selectedFiatSymbol };
    window.localStorage.setItem(`${KEY}-fiat`, JSON.stringify(obj));
  }

  function setBTC(amount) {
    btcElement.innerHTML = `${amount}`;
    calculateFiat(amount);
  }

  function calculateFiat(amount) {
    window.fetch(getBPIUrl(selectedFiat))
      .then(response => response.json())
      .then((data) => {
        const bpi = data.bpi[selectedFiat];
        const fiatAmount = amount * bpi.rate_float;
        setFiat(fiatAmount);
      });
  }

  function setFiat(amount) {
    fiatElement.innerHTML = `${amount.toFixed(2)}`;
    fiatSymbolElement.innerHTML = selectedFiatSymbol;
  }

  function editBTC() {
    const amountStr = window.prompt("Enter amount of BTC", "0.0");
    const amount = window.parseFloat(amountStr);
    if (isNaN(amount)) {
      window.alert('Entered amount could not be parsed as a float');
      return;
    }
    saveBTC(amount);
    setBTC(amount);
  }

  function selectFiat() {
    const value = fiatSelector.value.split(',');
    selectedFiat = value[0];
    selectedFiatSymbol = value[1];
    setBTC(btc);
    saveFiat();
  }

}();
