import React , { useEffect, useState, useReducer} from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice, getPremium, getTvl } from './commons/functions';
import { dStocks } from './commons/dstocks'

const ACTIONS = {
  UPSORTPREMIUM: 'upsortpremium',
  DOWNSORTPREMIUM: 'downsortpremium',
  UPSORTTVL: 'upsorttvl',
  DOWNSORTTVL: 'downsorttvl'
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
                                                        item.totalLiquidity.usd, item.apr.reward])
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
                                       tvl: getTvl(dexPriceList, dStock.symbol)
                                  })
                          )
            return arr
          }        

  return (
    
    <div className = "ui container">
      <h1>dStocks V 0.0.3</h1>
      <div>{console.log(sortList)}</div>
      <div>{dStocksList(oraclePriceList, dexPriceList, dStocks)
                .filter(item => item.ratio > 0)
                .sort(state.functionSort)
                .map(dStock => 
                <div key={dStock.name}>
                  {`${dStock.symbol} - ${dStock.name} - ${dStock.oraclePrice} - ${dStock.dexPrice} - ${dStock.ratio} - ${dStock.tvl}`}
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

    </div>
  );
}
// 
export default App;
