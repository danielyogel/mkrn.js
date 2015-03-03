export default {
    env: process.env.NODE_ENV || 'dev',
    port: 3000,
    db: {
        address: process.env.MONGODB_PORT_27017_TCP_ADDR || '127.0.0.1',
        port: process.env.MONGODB_PORT_27017_TCP_PORT || '27017',
        name: 'mkrn'
    }
}