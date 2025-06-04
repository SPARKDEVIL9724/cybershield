(() => {
  // Map platforms to OAuth login routes on backend. Add all platforms with proper URLs as you implement backend OAuth.
  const platformOAuthRoutes = {
    instagram: '/auth/instagram',  // backend to implement
    x: '/auth/x',                  // backend to implement
    snapchat: '/auth/snapchat',    // backend to implement
    facebook: '/auth/facebook',
    google: '/auth/google',
    telegram: '/auth/telegram',    // backend to implement
    youtube: '/auth/youtube'       // backend to implement
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
      settings: [
        { key: 'profile_private', label: 'Private Profile', description: 'Only approved followers can see your posts and stories.', default: true },
        { key: 'activity_status', label: 'Show Activity Status', description: 'Allow others to see when you were last active.', default: false },
        { key: 'story_sharing', label: 'Allow Story Sharing', description: 'Permit followers to share your stories.', default: true },
        { key: 'data_sharing', label: 'Data Sharing with Facebook', description: 'Allow Instagram to share data with Facebook for personalized ads.', default: false }
      ]
    },
    {
      id: 'x',
      name: 'X',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/X_Twitter_logo.svg',
      settings: [
        { key: 'protect_tweets', label: 'Protect Tweets', description: 'Only followers can see your tweets.', default: false },
        { key: 'location_sharing', label: 'Location Sharing', description: 'Add location to your tweets.', default: false },
        { key: 'direct_messages', label: 'Allow Direct Messages from Everyone', description: 'Allow anyone to send you direct messages.', default: false },
        { key: 'personalized_ads', label: 'Personalized Ads', description: 'Show ads based on your interests and activity.', default: true }
      ]
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1024px-Snapchat_logo.svg.png',
      settings: [
        { key: 'who_can_contact', label: 'Who Can Contact Me', description: 'Allow only friends or everyone to contact you.', default: true },
        { key: 'view_my_story', label: 'Who Can View My Story', description: 'Restrict story visibility to friends.', default: true },
        { key: 'share_location', label: 'Share My Location', description: 'Allow friends to see your location.', default: false },
        { key: 'ad_personalization', label: 'Ad Personalization', description: 'Allow Snapchat to personalize ads based on your data.', default: true }
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png',
      settings: [
        { key: 'profile_visibility', label: 'Profile Visibility', description: 'Control who can see your profile information.', default: true },
        { key: 'friend_requests', label: 'Who Can Send Friend Requests', description: 'Limit friend requests to friends of friends.', default: false },
        { key: 'ads_personalization', label: 'Ads Personalization', description: 'Allow Facebook to show personalized ads.', default: true },
        { key: 'location_history', label: 'Location History', description: 'Allow Facebook to save your location history.', default: false }
      ]
    },
    {
      id: 'google',
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      settings: [
        { key: 'activity_controls', label: 'Web & App Activity', description: 'Save your activity for personalized experience.', default: false },
        { key: 'ad_personalization', label: 'Ad Personalization', description: 'Allow personalized ads based on your activity.', default: true },
        { key: 'location_history', label: 'Location History', description: 'Save your location history.', default: false },
        { key: 'voice_recordings', label: 'Save Voice Recordings', description: 'Save your voice and audio activity.', default: false }
      ]
    },
    {
      id: 'telegram',
      name: 'Telegram',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      settings: [
        { key: 'last_seen', label: 'Who Can See My Last Seen', description: 'Control who can see your last online status.', default: true },
        { key: 'profile_photos', label: 'Who Can See My Profile Photos', description: 'Control who can see your profile photos.', default: true },
        { key: 'save_media', label: 'Save Media to Gallery', description: 'Automatically save media to your device gallery.', default: false },
        { key: 'two_step_verification', label: 'Two-Step Verification', description: 'Enable two-step verification for additional security.', default: true }
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg',
      settings: [
        { key: 'watch_history', label: 'Save Watch History', description: 'Save videos you watch for recommendations.', default: true },
        { key: 'search_history', label: 'Save Search History', description: 'Save your search queries.', default: true },
        { key: 'ad_personalization', label: 'Ad Personalization', description: 'Allow personalized ads on YouTube.', default: true },
        { key: 'comments_visibility', label: 'Comments Visibility', description: 'Control who can see your comments.', default: true }
      ]
    }
  ];

  // Load settings from localStorage or use defaults
  function loadSettings() {
    const saved = localStorage.getItem('privacySettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  }

  // Save settings to localStorage
  function saveSettings(settings) {
    localStorage.setItem('privacySettings', JSON.stringify(settings));
  }

  // Render all platform cards
  function renderPlatforms(container, savedSettings) {
    container.innerHTML = '';
    platforms.forEach(platform => {
      const card = document.createElement('div');
      card.className = 'platform-card';
      card.setAttribute('data-platform-id', platform.id);

      // LOGIN SECTION with OAuth links if available
      const loginSection = document.createElement('div');
      loginSection.className = 'login-section';

      const loginInfo = document.createElement('div');
      loginInfo.className = 'login-info';

      // Fetch loginUser from settings (for demo we don't store real OAuth user in localStorage)
      const loggedInUser = savedSettings[platform.id]?.loginUser || null;

      if (loggedInUser) {
        loginInfo.innerHTML = `Logged in as <span class="login-username"></span>`;
        loginInfo.querySelector('.login-username').textContent = loggedInUser;

        // Logout button, clears localStorage loginUser for platform
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'login-btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.title = 'Logout from ' + platform.name;
        logoutBtn.addEventListener('click', () => {
          savedSettings[platform.id].loginUser = null;
          saveSettings(savedSettings);
          renderPlatforms(container, savedSettings);
        });

        loginSection.appendChild(loginInfo);
        loginSection.appendChild(logoutBtn);
      } else {
        loginInfo.textContent = 'Not logged in';

        // If backend OAuth route exists for this platform, link the login button to it
        if (platformOAuthRoutes[platform.id]) {
          const loginLink = document.createElement('a');
          loginLink.href = platformOAuthRoutes[platform.id];
          loginLink.className = 'login-btn';
          loginLink.textContent = 'Login';
          loginLink.title = 'Login to ' + platform.name;
          loginSection.appendChild(loginInfo);
          loginSection.appendChild(loginLink);
        } else {
          // Backend OAuth not implemented for platform, use disabled button
          const disabledBtn = document.createElement('button');
          disabledBtn.className = 'login-btn';
          disabledBtn.textContent = 'Login';
          disabledBtn.title = 'Login not supported yet';
          disabledBtn.disabled = true;
          loginSection.appendChild(loginInfo);
          loginSection.appendChild(disabledBtn);
        }
      }

      card.appendChild(loginSection);

      // PLATFORM HEADER
      const header = document.createElement('div');
      header.className = 'platform-header';

      const logo = document.createElement('img');
      logo.className = 'platform-logo';
      logo.src = platform.logo;
      logo.alt = platform.name + " logo";
      header.appendChild(logo);

      const title = document.createElement('div');
      title.className = 'platform-title';
      title.textContent = platform.name;
      header.appendChild(title);

      card.appendChild(header);

      const list = document.createElement('ul');
      list.className = 'settings-list';

      const loggedIn = Boolean(savedSettings[platform.id]?.loginUser);

      platform.settings.forEach(setting => {
        const li = document.createElement('li');
        li.className = 'setting-item';

        // Label with tooltip
        const labelDiv = document.createElement('div');
        labelDiv.style.display = 'flex';
        labelDiv.style.flexDirection = 'column';

        const label = document.createElement('label');
        label.className = 'setting-label tooltip';
        label.htmlFor = platform.id + '-' + setting.key;
        label.textContent = setting.label;

        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltip-text';
        tooltipText.textContent = setting.description;
        label.appendChild(tooltipText);

        labelDiv.appendChild(label);
        li.appendChild(labelDiv);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'toggle-switch';
        checkbox.id = platform.id + '-' + setting.key;

        const platformSettings = savedSettings[platform.id] || {};
        checkbox.checked = typeof platformSettings[setting.key] === 'boolean' ? platformSettings[setting.key] : setting.default;
        checkbox.disabled = !loggedIn;

        checkbox.addEventListener('change', (e) => {
          if (!savedSettings[platform.id]) {
            savedSettings[platform.id] = {};
          }
          savedSettings[platform.id][setting.key] = e.target.checked;
          saveSettings(savedSettings);
        });

        const switchLabel = document.createElement('label');
        switchLabel.className = 'switch';
        switchLabel.htmlFor = checkbox.id;
        switchLabel.appendChild(checkbox);

        const sliderSpan = document.createElement('span');
        sliderSpan.className = 'slider';
        switchLabel.appendChild(sliderSpan);

        li.appendChild(switchLabel);

        list.appendChild(li);
      });

      card.appendChild(list);

      container.appendChild(card);
    });
  }

  function resetSettings() {
    if (confirm('Are you sure you want to reset all privacy settings and logins to default?')) {
      localStorage.removeItem('privacySettings');
      const defaults = {};
      platforms.forEach(p => {
        defaults[p.id] = {};
        p.settings.forEach(s => {
          defaults[p.id][s.key] = s.default;
        });
        defaults[p.id].loginUser = null;
      });
      renderPlatforms(document.getElementById('platforms-container'), defaults);
      saveSettings(defaults);
    }
  }

  // Initial load
  const savedSettings = loadSettings();

  // Normalize savedSettings to fill missing keys with defaults and loginUser null default
  platforms.forEach(p => {
    if (!savedSettings[p.id]) {
      savedSettings[p.id] = {};
    }
    p.settings.forEach(s => {
      if (typeof savedSettings[p.id][s.key] !== 'boolean') {
        savedSettings[p.id][s.key] = s.default;
      }
    });
    if (typeof savedSettings[p.id].loginUser !== 'string') {
      savedSettings[p.id].loginUser = null;
    }
  });

  const container = document.getElementById('platforms-container');
  renderPlatforms(container, savedSettings);

  document.getElementById('reset-btn').addEventListener('click', resetSettings);

  // To handle OAuth login callbacks that may pass login info in URL, e.g. ?login=google&name=John
  function trySetLoginFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const loginPlatform = urlParams.get('login');
    const loginName = urlParams.get('name');
    if (loginPlatform && loginName && savedSettings[loginPlatform]) {
      savedSettings[loginPlatform].loginUser = loginName;
      saveSettings(savedSettings);
      renderPlatforms(container, savedSettings);
      // Remove parameters from URL for clean state
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
  trySetLoginFromQuery();
})();