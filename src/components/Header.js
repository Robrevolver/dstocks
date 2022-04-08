import React, {useState, useEffect} from 'react'
import { btclogo, dfilogo } from '../commons/icons'
import './Header.css'

const Header = ({priceDFI, priceBTC, loading, searchTermInput}) => {
  
  const [search, setSearch] = useState('')  

  useEffect(()=> {searchTermInput(search)},[search,searchTermInput])

    return (
      <div>
        <div className= 'header'>
          <div><i className="chart line icon"></i>dStocks Quickcheck</div> 
            <div className='ticker'>
              <div className = 'symbol'>{dfilogo()}</div>{loading === true ? priceDFI : <i className="ui small active inline loader" />}
              <div className = 'symbol'>{btclogo()}</div>{loading === true ? priceBTC : <i className="ui small active inline loader" />}
            </div>
       
        </div>
          <input type = "text" value = {search} onChange = {(event) => setSearch(event.target.value)}></input>
        </div>
    )
}

export default Header