import React from 'react'
import { btclogo, dfilogo } from '../commons/icons'
import './Header.css'

const Header = ({priceDFI, priceBTC}) => {

    return (
        <div className= 'header'>
          <div><i className="chart line icon"></i>dStocks Quickcheck</div> 
            <div className='ticker'>
              <div className = 'symbol'>{dfilogo()}</div>{priceDFI}
              <div className = 'symbol'>{btclogo()}</div> {priceBTC}
            </div>
        </div>
    )

}

export default Header