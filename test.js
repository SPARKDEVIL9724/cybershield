const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to protect route with user session/authentication
router.post('/facebook/settings', async (req, res) => {
  const userToken = req.session.facebookAccessToken; // token stored after OAuth
  const { settingKey, settingValue } = req.body;

  if (!userToken) {
    return res.status(401).json({ error: 'User not authenticated with Facebook' });
  }

  try {
    if (settingKey === 'profile_visibility') {
      // Hypothetical endpoint and payload to change profile privacy
      // Facebook API does NOT openly support this dynamic setting update.
      // This is an illustrative example.

      const response = await axios.post(
        `https://graph.facebook.com/v14.0/me/privacy_settings`,
        {
          privacy_setting: settingValue ? 'Friends' : 'Public' // example value
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      return res.json({ success: true, result: response.data });
    }

    // handle other settings...

    return res.status(400).json({ error: 'Unsupported Facebook setting' });
  } catch (error) {
    console.error('Error updating Facebook setting:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to update Facebook setting' });
  }
});

module.exports = router;
