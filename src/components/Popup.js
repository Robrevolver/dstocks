import React from 'react';
import './Popup.css'

const myCurrency = {style:'currency',currency:'USD',minimumFractionDigits:2}

const Popup = ({showPopup, dstock}) => {
    return (
        <div className ='popup-container'>
            <div>{`Ticker: ${dstock.symbol}`}</div>
            <div>{`Name: ${dstock.name}`}</div><br/>
            <div>{`Oraclepreis: ${parseFloat(dstock.oraclePrice).toLocaleString('en-US', myCurrency)}`}</div>
            <div>{`DEXpreis: ${parseFloat(dstock.dexPrice).toLocaleString('en-US', myCurrency)}`}</div><br/>
            <div>{`Premium: ${dstock.ratio}%`}</div>
            <div>{`TVL: ${parseFloat(dstock.tvl).toLocaleString('en-US', myCurrency)}`}</div>
            <div>{`APR: ${dstock.apr}%`}</div>
            <br/>
            <div className = "ui small icon black basic button" onClick={showPopup}>back</div>
        </div>
    )
}

export default Popup