import React from 'react'
import { btclogo, dfilogo } from '../commons/icons'
import './Header.css'

const Header = ({priceDFI, priceBTC, loading}) => {

    return (
        <div className= 'header'>
          <div><i className="chart line icon"></i>dStocks Quickcheck</div> 
            <div className='ticker'>
              <div className = 'symbol'>{dfilogo()}</div>{loading === true ? priceDFI : <i className="ui small active inline loader" />}
              <div className = 'symbol'>{btclogo()}</div>{loading === true ? priceBTC : <i className="ui small active inline loader" />}
            </div>
        </div>
        
    )

}

export default Header