export default {
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    accessTokenExpiry: 1000 * 60 * 60, // miliseconds
    refreshTokenExpiry: 1000 * 60 * 60 * 24 * 30, // miliseconds
};
