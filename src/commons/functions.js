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