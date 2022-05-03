export function getOraclePrice(listObj, symbol) {
    for (const [key, value] of Object.values(listObj)) {
      if (key === symbol) {
        return parseFloat(value).toFixed(3)
        } 
      }
    }  

export function getDexPrice(listObj, symbol) {  
   for (const [key, value] of Object.values(listObj)) {
         if (key === symbol) {
             return parseFloat(value).toFixed(3)
         }
       }
    }    

export function getPremium(listObj1, listObj2, symbol) {
  return ((getDexPrice(listObj2,symbol)/getOraclePrice(listObj1,symbol)*100)-100).toFixed(1)
}

export const getTvl = (listObj, symbol) => {
  const result =  listObj.filter(item => item[0] === symbol).map(item => item[2])
  return result
} 

export const getApr = (listObj, symbol) => {
  const result =  listObj.filter(item => item[0] === symbol).map(item => item[3])
  return parseFloat(result*100).toFixed(1)
} 

export const getDexData = (listObj, symbol) => {

  const result =  listObj.filter(item => item[0] === symbol)
                         .map(item => Object.create({dexPrice: parseFloat(item[1]).toFixed(2),
                                                          tvl: parseFloat(item[2]).toFixed(2),
                                                        total: parseFloat(item[3]*100).toFixed(1),
                                                   commission: parseFloat(item[4]*100).toFixed(1),
                                                       reward: parseFloat(item[5]*100).toFixed(1)})                                
                              )
                              return result[0]
                             }