import React , { useEffect, useState, useReducer } from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice, getPremium, getTvl, getApr } from './commons/functions';
import { dStocks } from './commons/dstocks'
import Header from './components/Header';
import Footer from './components/Footer';
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
  const [state, dispatch] = useReducer(reducer,[])
 
  useEffect(()=> {const list = async () => {              
            const oraclePrices = await ocean.prices.list(90)
            const oraclePriceList = oraclePrices.map(item => [item.price.token, item.price.aggregated.amount])
            setOraclePriceList(oraclePriceList)

            const dexPrices = await ocean.poolpairs.list(90)
            const dexPriceList = dexPrices.map(item => [item.tokenA.symbol, item.priceRatio.ba, 
                                                        item.totalLiquidity.usd, item.apr.total])
            setDexPriceList(dexPriceList)                          
            }
    list()           
  },[]);

  const priceDFI = parseFloat(getOraclePrice(oraclePriceList, "DFI")).toLocaleString('en-US', myCurrency)
  const priceBTC = parseFloat(getOraclePrice(oraclePriceList, "BTC")).toLocaleString('en-US', myCurrency)

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

  return (   
    <div className = "ui container">
      <Header priceDFI={priceDFI} priceBTC={priceBTC}/>
            <hr/>
            <div className = "dstocklist">       
                <div className = "linebreak">  
                  <div className = "dstocksymbol">Ticker</div>
                  <div className = "dstockname">Name</div>
                </div>
                <div className = "linebreak">
                  <div className = "dstockprice">Oracleprice</div>
                  <div className = "dstockprice">Dexprice</div>
                </div>  
              <div className = "dstockpremiumhead"><button className = "ui compact icon black basic button" 
                    onClick = {onPremiumClick}>PRM<i className="compact sort icon"></i></button></div>
              <div className = "column-right"><button className = "ui compact icon black basic button" 
                    onClick = {onTvlClick}>TVL <i className="compact sort icon"></i></button></div>
              <div className = "column-right"><button className = "ui compact icon black basic button" 
                    onClick = {onAprClick}>APR <i className="compact sort icon"></i></button></div>
            </div>
        <hr/>
      <div>{dStocksList(oraclePriceList, dexPriceList, dStocks)
                .filter(item => item.ratio > 0)
                .sort(state.functionSort)
                .map(dStock => 
                <div key={dStock.name}>
                    <div className = "dstocklist"> 
                          <div className='linebreak'>                                               
                            <div className = "dstocksymbol">{dStock.symbol}</div>
                            <div className = "dstockname">{dStock.name}</div>
                          </div>
                          <div className='linebreak'> 
                            <div className = "dstockprice">{parseFloat(dStock.oraclePrice).toLocaleString('en-US', myCurrency)}</div>
                            <div className = "dstockprice">{parseFloat(dStock.dexPrice).toLocaleString('en-US', myCurrency) }</div>
                          </div>
                        <div className = "dstockpremium">{`${dStock.ratio}%`}</div>
                        <div className = "column-right">{parseFloat(dStock.tvl).toLocaleString('en-US' ,myCurrency)}</div>
                        <div className = "column-right">{`${dStock.apr}%`}</div>                                     
                    </div>                                 
                </div>)
        }        
      </div>
      <hr/>
      <Footer />    
    </div>
  );
}
// 
export default App;
