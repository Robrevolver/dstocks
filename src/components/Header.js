import React, {useState, useEffect} from 'react'
import { btclogo, dfilogo } from '../commons/icons'
import './Header.css'

const Header = ({priceDFI, priceBTC, loading, searchTermInput}) => {
  
  const [search, setSearch] = useState('')  
  
  const clearSearch = () => {
    setSearch("")
    return()=>clearSearch(search)
  }

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
            <div className="ui mini icon focus input">
              <input type = "text" placeholder="Ticker..."
                     value = {search} onChange = {(event) => setSearch(event.target.value)}></input>
              <i className="circular undo link icon" onClick = {clearSearch}></i>
            </div>         
      </div>
    )
}

export default Header