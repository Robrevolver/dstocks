import React from 'react';
import './Popup.css'

const Popup = ({showPopup, showName}) => {
    return (
        <div className ='popup-open'>
            <h1>{showName}</h1>
            <div className = "ui mini icon button" onClick={showPopup}>back</div>
        </div>
    )
}

export default Popup