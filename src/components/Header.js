import React from 'react'
import { btclogo, dfilogo } from '../commons/icons'

const Header = ({priceDFI, priceBTC}) => {

    return (
        <h2><i className="chart line icon"></i>dStocks Quickcheck {dfilogo()} {priceDFI} {btclogo()} {priceBTC}
      </h2>
    )

}

export default Header