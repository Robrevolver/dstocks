import React , { useEffect, useState, useReducer} from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice, getPremium, getTvl, getApr } from './commons/functions';
import { dStocks } from './commons/dstocks'
import './App.css'

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

  return (
    
    <div className = "ui container">
      <h1>dStocks V 0.0.6</h1>
      <div></div>
        <table>
          <tbody>
            <tr>
              <th className = "column-left">Ticker</th>
              <th className = "column-left">Name</th>
              <th className = "column-right">Oraclepreis</th>
              <th className = "column-right">Dexpreis</th>
              <th className = "column-right">Premium</th>
              <th className = "column-right">TVL</th>
              <th className = "column-right">APR</th>
              </tr>
          </tbody>
        </table>
        <hr></hr>
      <div>{dStocksList(oraclePriceList, dexPriceList, dStocks)
                .filter(item => item.ratio > 0)
                .sort(state.functionSort)
                .map(dStock => 
                <div key={dStock.name}>
                    <div className = "data-list">                    
                    <table>
                      <tbody>
                      <tr>
                        <th className = "column-left">{dStock.symbol}</th>
                        <th className = "column-left">{dStock.name}</th>
                        <th className = "column-right">{dStock.oraclePrice}</th>
                        <th className = "column-right">{dStock.dexPrice}</th>
                        <th className = "column-right">{dStock.ratio}</th>
                        <th className = "column-right">{dStock.tvl}</th>
                        <th className = "column-right">{dStock.apr}</th>
                      </tr>
                      </tbody>
                    </table>                    
                    </div>                                 
                </div>             
                )
        }
        
      </div>
      <button onClick = {()=>{setSortList(!sortList)
                              sortList ? dispatch({type: ACTIONS.UPSORTPREMIUM }) 
                                       : dispatch({type: ACTIONS.DOWNSORTPREMIUM})}}>sortPremium</button>
      <button onClick = {()=>{setSortList(!sortList) 
                              sortList ? dispatch({type: ACTIONS.UPSORTTVL }) 
                                       : dispatch({type: ACTIONS.DOWNSORTTVL})}}>sortTvl</button>
      <button onClick = {()=>{setSortList(!sortList) 
                              sortList ? dispatch({type: ACTIONS.UPSORTAPR }) 
                                       : dispatch({type: ACTIONS.DOWNSORTAPR})}}>sortApr</button>
    
    </div>
  );
}
// 
export default App;
