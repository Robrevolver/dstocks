import React from 'react';
import './Popup.css'

const myCurrency = {style:'currency',currency:'USD',minimumFractionDigits:2}

const Popup = ({showPopup, dstock}) => {

    const aprToApy = (interest, frequency) => (((1 + (interest/100/frequency)) ** frequency) - 1)*100;

    return (
      <div className ='popup-container'>
            <div className="popup-unit-row">
                  <div className="popup-unit">
                        <div className="popup-value"><i className="chart line icon"></i> {dstock.symbol}</div>
                        <div className="popup-label">{dstock.name}</div>
                  </div>
                  <div className="popup-unit">
                        <div className="popup-value"><i className="info circle icon"></i>{dstock.ratio} %</div>
                        <div className="popup-label">Premium</div>
                  </div>
            </div>      
            <div className="popup-unit-row">
                  <div className="popup-unit">
                        <div className="popup-value"><i className="money bill alternate outline icon"></i> {parseFloat(dstock.oraclePrice).toLocaleString('en-US', myCurrency)}</div>
                        <div className="popup-label">Oracleprice</div>
                  </div>
                  <div className="popup-unit">
                        <div className="popup-value"><i className="money bill alternate outline icon"></i> {parseFloat(dstock.dexPrice).toLocaleString('en-US', myCurrency)}</div>
                        <div className="popup-label">DEXprice</div>
                  </div>
            </div>
            <div className="popup-unit-row">   
                  <div className="popup-unit">
                        <div className="popup-value"><i className="lock icon"></i> {parseFloat(dstock.tvl).toLocaleString('en-US', myCurrency)}</div>
                        <div className="popup-label">Total Value locked</div>                
                  </div>
            </div>
            <div className="popup-unit-row-border">
                  <div className="popup-unit">
                        <div className="popup-value">{dstock.apr} %</div>
                        <div className="popup-label">APR total</div>
                  </div>
                  <div className="popup-unit">
                        <div className="popup-value">{dstock.commission} %</div>
                        <div className="popup-label">Commission</div>
                  </div>
                  <div className="popup-unit">
                        <div className="popup-value">{dstock.reward} %</div>
                        <div className="popup-label">Reward</div>
                  </div>
            </div>
            <div className="popup-unit-row-border">
                  <div className="popup-unit">
                        <div className="popup-value">{aprToApy(dstock.apr, 365).toFixed(1)} %</div>
                        <div className="popup-label">APY daily</div>
                  </div>
                  <div className="popup-unit">
                        <div className="popup-value">{aprToApy(dstock.apr, 52).toFixed(1)} %</div>
                        <div className="popup-label">APY weekly</div>
                  </div>                
                  <div className="popup-unit">
                        <div className="popup-value">{aprToApy(dstock.apr, 12).toFixed(1)} %</div>
                        <div className="popup-label">APY monthly</div>
                  </div>
            </div>         
            <div className = "ui small icon black basic button" onClick={showPopup}>close</div>
      </div>
    )
}

export default Popup