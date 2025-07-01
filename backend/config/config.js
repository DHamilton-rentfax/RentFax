// config/config.js

require('dotenv-flow').config();

const config = {
  env: process.env.NODE_ENV || 'development',

  server: {
    port: process.env.PORT || 5000,
  },

  database: {
    uri: process.env.MONGO_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: '7d',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    couponId: process.env.STRIPE_COUPON_ID,
    priceOneTime: process.env.STRIPE_PRICE_ONE_TIME,
    pricePro: process.env.STRIPE_PRICE_PRO,
    priceUnlimited: process.env.STRIPE_PRICE_UNLIMITED,
  },

  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5175'],
  },

  client: {
    url: process.env.CLIENT_URL,
  },
};

module.exports = config;
