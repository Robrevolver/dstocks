import { WhaleApiClient } from '@defichain/whale-api-client'

const ocean = new WhaleApiClient({
    version: 'v0',
    network: 'mainnet',
    url: 'https://ocean.defichain.com'
    })


export default ocean