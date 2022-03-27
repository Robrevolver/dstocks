import React , { useEffect, useState, useReducer } from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice, getPremium, getTvl, getApr } from './commons/functions';
import { dStocks } from './commons/dstocks'
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
      <h2><i className="chart line icon"></i>dStocks Quickcheck {` - DFI: ${priceDFI} - BTC: ${priceBTC}`}</h2>
      <div></div>
        <table>
          <tbody>
            <tr>
              <th className = "column-left-small">Ticker</th>
              <th className = "column-left">Name</th>
              <th className = "column-right">Oracleprice</th>
              <th className = "column-right">Dexprice</th>
              <th className = "column-right"><button className = "ui compact icon black basic button" 
                    onClick = {onPremiumClick}>Premium <i className="compact sort icon"></i></button></th>
              <th className = "column-right"><button className = "ui compact icon black basic button" 
                    onClick = {onTvlClick}>TVL <i className="compact sort icon"></i></button></th>
              <th className = "column-right"><button className = "ui compact icon black basic button" 
                    onClick = {onAprClick}>APR <i className="compact sort icon"></i></button></th>
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
                        <th className = "column-left-small">{dStock.symbol}</th>
                        <th className = "column-left">{dStock.name}</th>
                        <th className = "column-right">{parseFloat(dStock.oraclePrice).toLocaleString('en-US', myCurrency)}</th>
                        <th className = "column-right">{parseFloat(dStock.dexPrice).toLocaleString('en-US', myCurrency) }</th>
                        <th className = "column-right">{`${dStock.ratio}%`}</th>
                        <th className = "column-right">{parseFloat(dStock.tvl).toLocaleString('en-US' ,myCurrency)}</th>
                        <th className = "column-right">{`${dStock.apr}%`}</th>
                      </tr>
                      </tbody>
                    </table>                    
                    </div>                                 
                </div>)
        }        
      </div>
      <hr></hr>
      <small>If you like this webapp and use it: df1qcjmlv795j0j2n9crpf9dmxhh5wyhz6ltwwwz4l</small>
      <br></br>
      <small>0.0.9 / twitter: @robrevolver1 / reddit: @robbiraptor</small>  
    </div>
  );
}
// 
export default App;
