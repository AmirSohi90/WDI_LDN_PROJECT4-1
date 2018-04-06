const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 4000;
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/content-${env}`;
const secret = process.env.SECRET || 'J(*U)J-H(*)(J_)';

module.exports = { env, port, dbURI, secret };
