import React from 'react';
import './Popup.css'

const myCurrency = {style:'currency',currency:'USD',minimumFractionDigits:2}

const Popup = ({showPopup, dstock}) => {
    return (
        <div className ='popup'>
            <div>{dstock.symbol}</div>
            <div>{dstock.name}</div>
            <div>{parseFloat(dstock.oraclePrice).toLocaleString('en-US', myCurrency)}</div>
            <div>{parseFloat(dstock.dexPrice).toLocaleString('en-US', myCurrency)}</div>
            <div>{`${dstock.ratio}%`}</div>
            <div>{parseFloat(dstock.tvl).toLocaleString('en-US', myCurrency)}</div>
            <div>{`${dstock.apr}%`}</div>
            <hr/>
            <div className = "ui mini icon black basic button" onClick={showPopup}>back</div>
        </div>
    )
}

export default Popup