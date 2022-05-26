import React, {useState, useEffect} from 'react'
import { btclogo, dfilogo, dusdlogo } from '../commons/icons'
import './Header.css'

const Header = ({priceDFI, priceBTC, priceDUSD, loading, searchTermInput}) => {
  
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
              <div className = 'symbol'>{dusdlogo()}</div>{loading === true ? priceDUSD : <i className="ui small active inline loader" />}
            </div>      
        </div>
            <div className='searchrow'>
              <div className="ui mini icon focus input">
                <input type = "text" placeholder="Ticker..." value = {search} 
                       onChange = {(event) => setSearch(event.target.value)}></input>
                      <i className="circular undo link icon" onClick = {clearSearch}></i>
              </div>
              <div className='update'>Click/tap on stock ticker</div> 
            </div>  
      </div>
    )
}

export default Header