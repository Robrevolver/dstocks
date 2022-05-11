import React from 'react'

const openLink = () => {
  let url = 'https://www.defichainarthistory.com';
  let win = window.open(url, '_blank');
  win.focus();
}

const Footer = () => {

    return (
        <div>
          <div>PRM = Premium - Surcharge on the DEX in percent compared to the Oracle price</div>
          <div>Total Value = TVL - Value of the associated liquidity pool</div>
          <div>APR = Annual Percentage Rate - the return on the respective liquidity pool in the year</div>
          <br/>
          <div>Pricing dUSD: DEXprice dUSD to Dexprice USDC/USDT</div>
          <br/>
          <div>If you like this webapp and use it: df1qcjmlv795j0j2n9crpf9dmxhh5wyhz6ltwwwz4l</div>
          <br/>
          <div onClick={openLink}>0.4.2 / twitter: @robrevolver1 / reddit: @robbiraptor / <u>defichainarthistory.com</u></div>
          <br/>      
        </div>
    )

}

export default Footer