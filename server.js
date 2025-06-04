// Backend server for OAuth2 authentication for multiple platforms
// Example implementation for Google and Facebook OAuth2 using Express.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const qs = require('querystring');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Session middleware to store logged-in user info (demo purpose)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve frontend static HTML from a public folder
app.use(express.static(path.join(__dirname, '../frontend')));

// -------- GOOGLE OAUTH2 --------

const googleOAuthConfig = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
  auth_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  token_endpoint: 'https://oauth2.googleapis.com/token',
  userinfo_endpoint: 'https://openidconnect.googleapis.com/v1/userinfo'
};

app.get('/auth/google', (req, res) => {
  const scope = [
    'openid',
    'profile',
    'email'
  ].join(' ');
  const params = {
    client_id: googleOAuthConfig.client_id,
    redirect_uri: googleOAuthConfig.redirect_uri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent'
  };
  const authUrl = `${googleOAuthConfig.auth_endpoint}?${qs.stringify(params)}`;
  res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.status(400).send('No code returned');
    return;
  }
  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(googleOAuthConfig.token_endpoint, qs.stringify({
      code,
      client_id: googleOAuthConfig.client_id,
      client_secret: googleOAuthConfig.client_secret,
      redirect_uri: googleOAuthConfig.redirect_uri,
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const { access_token, id_token } = tokenResponse.data;
    // Get user info
    const userInfoResponse = await axios.get(googleOAuthConfig.userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const user = userInfoResponse.data;
    req.session.user = {
      platform: 'google',
      info: user
    };
    // Redirect user to frontend with login info or success message
    res.redirect('/?login=google&name=' + encodeURIComponent(user.name || user.email));
  } catch (err) {
    console.error('Google OAuth callback error:', err.message);
    res.status(500).send('Google Authentication Failed');
  }
});

// -------- FACEBOOK OAUTH2 --------

const facebookOAuthConfig = {
  client_id: process.env.FACEBOOK_CLIENT_ID,
  client_secret: process.env.FACEBOOK_CLIENT_SECRET,
  redirect_uri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback',
  auth_endpoint: 'https://www.facebook.com/v14.0/dialog/oauth',
  token_endpoint: 'https://graph.facebook.com/v14.0/oauth/access_token',
  userinfo_endpoint: 'https://graph.facebook.com/me'
};

app.get('/auth/facebook', (req, res) => {
  const params = {
    client_id: facebookOAuthConfig.client_id,
    redirect_uri: facebookOAuthConfig.redirect_uri,
    response_type: 'code',
    scope: 'email,public_profile'
  };
  const authUrl = `${facebookOAuthConfig.auth_endpoint}?${qs.stringify(params)}`;
  res.redirect(authUrl);
});

app.get('/auth/facebook/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.status(400).send('No code returned');
    return;
  }
  try {
    // Exchange code for tokens
    const tokenResponse = await axios.get(facebookOAuthConfig.token_endpoint, {
      params: {
        client_id: facebookOAuthConfig.client_id,
        client_secret: facebookOAuthConfig.client_secret,
        redirect_uri: facebookOAuthConfig.redirect_uri,
        code
      }
    });
    const access_token = tokenResponse.data.access_token;
    // Get user info
    const userInfoResponse = await axios.get(facebookOAuthConfig.userinfo_endpoint, {
      params: {
        access_token,
        fields: 'id,name,email'
      }
    });
    const user = userInfoResponse.data;
    req.session.user = {
      platform: 'facebook',
      info: user
    };
    // Redirect user to frontend with login info or success message
    res.redirect('/?login=facebook&name=' + encodeURIComponent(user.name || user.email));
  } catch (err) {
    console.error('Facebook OAuth callback error:', err.message);
    res.status(500).send('Facebook Authentication Failed');
  }
});

// -------- SIMPLE LOGOUT --------

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Google OAuth login: http://localhost:${port}/auth/google`);
  console.log(`Facebook OAuth login: http://localhost:${port}/auth/facebook`);
});

