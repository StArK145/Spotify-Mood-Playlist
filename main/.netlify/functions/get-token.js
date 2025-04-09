import axios from "axios";

const axios = require('axios');


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


let cachedToken = null;
let tokenExpiresAt = 0;

exports.handler = async function () {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return {
      statusCode: 200,
      body: JSON.stringify({ token: cachedToken }),
    };
  }

  try {
    const result = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    cachedToken = result.data.access_token;
    tokenExpiresAt = now + result.data.expires_in * 1000;

    return {
      statusCode: 200,
      body: JSON.stringify({ token: cachedToken }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch token' }),
    };
  }
};
