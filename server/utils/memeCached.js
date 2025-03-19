import memjs from 'memjs'
import logger from './logger.js'
const MEMCACHED_HOST = process.env.MEMCACHED_HOST || "localhost:11211";
try {
    var memcache = memjs.Client.create(MEMCACHED_HOST)
    logger.info('memecached connected')
} catch (error) {
        logger.error('error in memecahed connection')
}
export default memcache