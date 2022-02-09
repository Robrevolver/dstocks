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