import React , { useEffect, useState, useReducer } from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice, getPremium, getTvl, getApr } from './commons/functions';
import { dStocks } from './commons/dstocks'
import Header from './components/Header';
import Footer from './components/Footer';
import Popup from './components/Popup';
import './App.css'

const myCurrency = {style:'currency',currency:'USD',minimumFractionDigits:2}

const ACTIONS = {
  UPSORTPREMIUM: 'upsortpremium',
  DOWNSORTPREMIUM: 'downsortpremium',
  UPSORTTVL: 'upsorttvl',
  DOWNSORTTVL: 'downsorttvl',
  UPSORTAPR: 'upsortapr',
  DOWNSORTAPR: 'downsortapr'
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPSORTPREMIUM:
      return {functionSort: (a,b) => a.ratio - b.ratio}
    case ACTIONS.DOWNSORTPREMIUM:
      return {functionSort: (a,b) => b.ratio - a.ratio}
    case ACTIONS.UPSORTTVL:
      return {functionSort: (a,b) => a.tvl - b.tvl}
    case ACTIONS.DOWNSORTTVL:
      return {functionSort: (a,b) => b.tvl - a.tvl}
    case ACTIONS.UPSORTAPR:
      return {functionSort: (a,b) => a.apr - b.apr}
    case ACTIONS.DOWNSORTAPR:
      return {functionSort: (a,b) => b.apr - a.apr}
    default:  
    }
  }

const App = () => {

  const [oraclePriceList, setOraclePriceList] = useState([])
  const [dexPriceList, setDexPriceList] = useState([])
  const [sortList, setSortList] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [popup, setPopup] = useState({visible: false, dstock: {symbol: "", name: "", oraclePrice:"", dexPrice:"",
                                                               ratio:"", tvl: "", apr:""}})
  const [state, dispatch] = useReducer(reducer,[])
 
  useEffect(()=> {const list = async () => {              
            const oraclePrices = await ocean.prices.list(100)
            const oraclePriceList = oraclePrices.map(item => [item.price.token, item.price.aggregated.amount])
            setOraclePriceList(oraclePriceList)
  
            const dexPrices = await ocean.poolpairs.list(100)
            const dexPriceList = dexPrices.map(item => [item.tokenA.symbol, item.priceRatio.ba, 
                                                        item.totalLiquidity.usd, item.apr.total, 
                                                        item.apr.commission,item.apr.reward])
            setDexPriceList(dexPriceList)  
            console.log(dexPrices)
            setLoading(true)                        
            }
          list()
          
          const interval=setInterval(()=>{list()},60000)
          return()=>clearInterval(interval)

  },[]);

  const priceDFI = parseFloat(getOraclePrice(oraclePriceList, "DFI")).toLocaleString('en-US', myCurrency)
  const priceBTC = parseFloat(getOraclePrice(oraclePriceList, "BTC")).toLocaleString('en-US', myCurrency)
  // console.log(oraclePriceList)

  const dStocksList = (oraclePriceList, dexPriceList, dStocks ) => {            
    let arr=[]               
    dStocks.map(dStock => arr.push({symbol: dStock.symbol, 
                                      name: dStock.name,
                               oraclePrice: getOraclePrice(oraclePriceList, dStock.symbol),
                                  dexPrice: getDexPrice(dexPriceList, dStock.symbol),
                                     ratio: getPremium(oraclePriceList, dexPriceList, dStock.symbol),
                                       tvl: getTvl(dexPriceList, dStock.symbol),
                                       apr: getApr(dexPriceList, dStock.symbol)
                                  })
                          )
            return arr
          }        
    const onPremiumClick = () => {setSortList(!sortList);
          sortList ? dispatch({type: ACTIONS.UPSORTPREMIUM }) 
                   : dispatch({type: ACTIONS.DOWNSORTPREMIUM})}
    const onTvlClick = () => {setSortList(!sortList);
          sortList ? dispatch({type: ACTIONS.UPSORTTVL }) 
                   : dispatch({type: ACTIONS.DOWNSORTTVL})}
    const onAprClick = () => {setSortList(!sortList);
          sortList ? dispatch({type: ACTIONS.UPSORTAPR }) 
                   : dispatch({type: ACTIONS.DOWNSORTAPR})}

    const searchTermInput = (input) => {
          setSearchTerm(input.toUpperCase())
          }
    
    const showPopup = (symbol, name, oraclePrice, dexPrice, ratio, tvl, apr) => {
      setPopup({visible: !popup.visible, dstock:{symbol: symbol, name: name, oraclePrice: oraclePrice, 
                                                 dexPrice: dexPrice, ratio: ratio, tvl: tvl, apr: apr}});
          }      
       
  return (   
    <div className = "page-container">
      <Header priceDFI={priceDFI} priceBTC={priceBTC} loading={loading} searchTermInput = {searchTermInput}/>
            <hr/>
            <div className = "dstocklist" >       
                <div className = "linebreak">  
                  <div className = "dstocksymbolheader">Ticker</div>
                  <div className = "dstocknameheader">Name</div>
                </div>
                <div className = "linebreak">
                  <div className = "dstockprice">Oracleprice</div>
                  <div className = "dstockprice">Dexprice</div>
                </div>  
              <div className = "dstockpremium"><button className = "ui mini icon black basic button" 
                    onClick = {onPremiumClick}>PRM<i className="sort icon"></i></button></div>
              <div className = "dstocktvl"><button className = "ui mini icon black basic button" 
                    onClick = {onTvlClick}>Total Value <i className="sort icon"></i></button></div>
              <div className = "dstockapr"><button className = "ui mini icon black basic button" 
                    onClick = {onAprClick}>APR <i className="sort icon"></i></button></div>
            </div>
          <hr/>
          <div>{dStocksList(oraclePriceList, dexPriceList, dStocks)
                .filter(item => (item.symbol.substr(0,searchTerm.length)) === searchTerm)
                .sort(state.functionSort)
                .map(dStock => 
                <div key={dStock.name}>
                    <div className = "dstocklist" onClick={()=>{showPopup(dStock.symbol, dStock.name, dStock.oraclePrice,
                                                                          dStock.dexPrice, dStock.ratio, dStock.tvl, dStock.apr )}}> 
                          <div className='linebreak'>                                               
                            <div className = "dstocksymbol">{dStock.symbol}</div>
                            <div className = "dstockname">{dStock.name}</div>
                          </div>
                          <div className='linebreak'> 
                            <div className = "dstockprice">{loading === true ? parseFloat(dStock.oraclePrice).toLocaleString('en-US', myCurrency) :
                                                                            <i className="ui mini active inline loader" />}</div>
                            <div className = "dstockprice">{loading === true ? parseFloat(dStock.dexPrice).toLocaleString('en-US', myCurrency) :
                                                                            <i className="ui mini active inline loader" />}</div>
                          </div>
                        <div className = "dstockpremium">{loading === true ? `${dStock.ratio}%` : <i className="ui mini active inline loader" />}</div>
                        <div className = "dstocktvl">{loading === true ? parseFloat(dStock.tvl).toLocaleString('en-US' ,myCurrency) :
                                                                            <i className="ui mini active inline loader" />}</div>
                        <div className = "dstockapr">{loading === true ? `${dStock.apr}%` : <i className="ui mini active inline loader" />}</div>                                     
                    </div>                                 
                </div>)
            }        
          </div>
      <hr/>
      <Footer />    
      {popup.visible ? <Popup showPopup={showPopup} dstock={popup.dstock}/> : null} 
    </div>
  );
}
export default App;
