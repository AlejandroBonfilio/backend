
const dotenv = require('dotenv');
dotenv.config({ path: process.env});



module.exports = {
  githubClientID:process.env.CLIENT_ID,
  githubClientSecret:process.env.CLIENT_SECRET,
 
  mongoURI:process.env.MONGO_URI,
  sessionSecret:process.env.SESSION_SECRET,
  
  
  
 
};

