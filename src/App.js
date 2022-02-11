import React , { useEffect, useState } from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice, getPremium, getTvl } from './commons/functions';
import { dStocks } from './commons/dstocks'

const App = () => {

  const [oraclePriceList, setOraclePriceList] = useState([])
  const [dexPriceList, setDexPriceList] = useState([])
  const [sortPremium, setPremiumSort] = useState([true])
 
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
      <h1>dStocks V 0.0.2</h1>
      <div></div>
      <div>{dStocksList(oraclePriceList, dexPriceList, dStocks)
                .filter(item => item.ratio > 0)
                .sort((a,b) => sortPremium ? b.ratio - a.ratio : a.ratio - b.ratio)
                .map(dStock => 
                <div key={dStock.name}>
                  {`${dStock.symbol} - ${dStock.name} - ${dStock.oraclePrice} - ${dStock.dexPrice} - ${dStock.ratio} - ${dStock.tvl}`}
                </div>
                )
        }
      </div>
      <button onClick = {() => setPremiumSort(!sortPremium)}>sortPremium</button>
    </div>
  );
}
// 
export default App;
