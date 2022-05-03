import React from 'react';
import './Popup.css'

const myCurrency = {style:'currency',currency:'USD',minimumFractionDigits:2}

const Popup = ({showPopup, dstock}) => {
    return (
        <div className ='popup-container'>
             <div className="ui tiny statistic">
                  <div className="value"><i className="chart line icon"></i> {dstock.symbol}</div>
                  <div className="label">{dstock.name}</div>
            </div><br/>
            <div className="ui mini statistic">
                  <div className="value"><i className="money bill alternate outline icon"></i> {parseFloat(dstock.oraclePrice).toLocaleString('en-US', myCurrency)}</div>
                  <div className="label">Oracleprice</div>
            </div>
            <div className="ui mini statistic">
                  <div className="value"><i className="money bill alternate outline icon"></i> {parseFloat(dstock.dexPrice).toLocaleString('en-US', myCurrency)}</div>
                  <div className="label">DEXprice</div>
            </div>
            <div className="ui tiny statistic">
                  <div className="value"><i className="exclamation icon"></i> {dstock.ratio} %</div>
                  <div className="label">Premium</div>
            </div>
            <div className="ui tiny statistic">
                  <div className="value">{dstock.apr} %</div>
                  <div className="label">APR total</div>
            </div><br/>
            <div className="ui tiny statistic">
                  <div className="value">{dstock.commission} %</div>
                  <div className="label">Commission</div>
            </div>
            <div className="ui tiny statistic">
                  <div className="value">{dstock.reward} %</div>
                  <div className="label">Reward</div>
            </div><br/>
            <div className="ui tiny statistic">
                  <div className="value"><i className="lock icon"></i> {parseFloat(dstock.tvl).toLocaleString('en-US', myCurrency)}</div>
                  <div className="label">Total Value locked</div>
            </div> <br/>          
            <div className = "ui small icon black basic button" onClick={showPopup}>close</div>
        </div>
    )
}

export default Popup