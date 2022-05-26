import React , { useEffect, useState, useReducer } from 'react';
import ocean from './components/OceanClient'
import { getDexData, getDexPriceA, getDexPriceB, getOraclePrice, getPremium} from './commons/functions';
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
  const [popup, setPopup] = useState({visible: false, dstockPopup: {symbol: "", name: "", oraclePrice:"", dexPrice:"",
                                                               ratio:"", tvl: "", apr:"", commission:"", reward:""}})
  const [state, dispatch] = useReducer(reducer,[])
 
  useEffect(()=> {const list = async () => {              
            
            //const chartPrices = await ocean.prices.getFeedWithInterval()
            //console.log(chartPrices) 

            const oraclePrices = await ocean.prices.list(100)
            const oraclePriceList = oraclePrices.map(item => [item.price.token, item.price.aggregated.amount])
            setOraclePriceList(oraclePriceList)
  
            const dexPrices = await ocean.poolpairs.list(40)
            const dexPriceList = dexPrices.map(item => [item.tokenA.symbol, item.priceRatio.ba, 
                                                        item.totalLiquidity.usd, item.apr.total, 
                                                        item.apr.commission,item.apr.reward,item.priceRatio.ab])
            setDexPriceList(dexPriceList)  
            setLoading(true)                               

            }
          list()
          
          const interval=setInterval(()=>{list()},60000)
          return()=>clearInterval(interval)

  },[]);

  const priceDFI = parseFloat(getOraclePrice(oraclePriceList, "DFI")).toLocaleString('en-US', myCurrency)
  const priceBTC = parseFloat(getOraclePrice(oraclePriceList, "BTC")).toLocaleString('en-US', myCurrency)
  const priceDUSD = parseFloat(getDexPriceA(dexPriceList, "DUSD") * getDexPriceB(dexPriceList, "USDC")).toLocaleString('en-US', myCurrency)

  // console.log(getDexPriceA(dexPriceList, "DUSD")*getDexPriceB(dexPriceList, "USDC"))

  const dStocksList = (oraclePriceList, dexPriceList, dStocks ) => {            
    let arr = []
    dStocks.map(dStock => {let dstockObj = getDexData(dexPriceList, dStock.symbol);                            
                            return (dstockObj !== undefined ? 
                             arr.push({symbol: dStock.symbol, 
                                         name: dStock.name,
                                  oraclePrice: getOraclePrice(oraclePriceList, dStock.symbol),
                                     dexPrice: dstockObj.dexPrice, 
                                        ratio: getPremium(oraclePriceList, dexPriceList, dStock.symbol),
                                          tvl: dstockObj.tvl, 
                                          apr: dstockObj.total,
                                   commission: dstockObj.commission,
                                       reward: dstockObj.reward
                                }) : null
                                ) 
                            }   
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
    
    const showPopup = (symbol, name, oraclePrice, dexPrice, ratio, tvl, apr, commission, reward) => {
              setPopup({visible: !popup.visible, dstockPopup:{symbol,name,oraclePrice,dexPrice,ratio,tvl,apr,commission,reward }});
          }      
          
  return dexPriceList !==[] ? (   
    
    <div className = "page-container"> 
      <Header priceDFI={priceDFI} priceDUSD={priceDUSD} priceBTC={priceBTC} loading={loading} searchTermInput = {searchTermInput}/>
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
                                                                          dStock.dexPrice, dStock.ratio, dStock.tvl, dStock.apr,
                                                                          dStock.commission, dStock.reward)}}> 
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
      {popup.visible ? <Popup showPopup={showPopup} dstock={popup.dstockPopup}/> : null} 
    </div>
  ) : null;
}
export default App;
