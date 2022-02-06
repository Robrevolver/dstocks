import React , { useEffect, useState} from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice } from './commons/functions';
import { dStocks } from './commons/dstocks'

console.log(dStocks)

const App = () => {

  const [oraclePriceList, setOraclePriceList] = useState([])
  const [dexPriceList, setDexPriceList] = useState([])
 
  useEffect(()=> {const list = async () => { 
              
            const oraclePrices = await ocean.prices.list(90)
            const oraclePriceList = oraclePrices.map(item => [item.price.token, item.price.aggregated.amount])
            setOraclePriceList(oraclePriceList)
            console.log(oraclePriceList)

            const dexPrices = await ocean.poolpairs.list(90)
            const dexPriceList = dexPrices.map(item => [item.tokenA.symbol, item.priceRatio.ba])
            setDexPriceList(dexPriceList)
            console.log(dexPriceList)               
            }
    list()

  },[]);

  const dStocksList = dStocks.map(dStock => (
        <div> {`${dStock.symbol} ${dStock.name} 
              ${getOraclePrice(oraclePriceList,dStock.symbol)} 
              ${(getDexPrice(dexPriceList,dStock.symbol))}`}
        </div>
        ))

  return (
    
    <div>
      <h1>dStocks</h1>
      <div></div>
      <div>{dStocksList}</div>
    </div>
  );
}


export default App;
