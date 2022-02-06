import React , { useEffect, useState} from 'react';
import ocean from './components/OceanClient'
import { getOraclePrice, getDexPrice, getPremium } from './commons/functions';
import { dStocks } from './commons/dstocks'

const App = () => {

  const [oraclePriceList, setOraclePriceList] = useState([])
  const [dexPriceList, setDexPriceList] = useState([])
 
  useEffect(()=> {const list = async () => { 
              
            const oraclePrices = await ocean.prices.list(90)
            const oraclePriceList = oraclePrices.map(item => [item.price.token, item.price.aggregated.amount])
            setOraclePriceList(oraclePriceList)
            // console.log(oraclePriceList)

            const dexPrices = await ocean.poolpairs.list(90)
            const dexPriceList = dexPrices.map(item => [item.tokenA.symbol, item.priceRatio.ba])
            setDexPriceList(dexPriceList)
            // console.log(dexPriceList)               
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
                                  })
                          )
            return arr
  }

  return (
    
    <div>
      <h1>dStocks</h1>
      <div></div>
      <div>{dStocksList(oraclePriceList, dexPriceList, dStocks).map(dStock => 
        <div key={dStock.name}>
          {`${dStock.name} - ${dStock.oraclePrice} - ${dStock.dexPrice} - ${dStock.ratio}`}
        </div>)
        }
      </div>
    </div>
  );
}


export default App;
