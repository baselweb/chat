function updateStatusBar(theme) {
  // Update the theme-color meta tag dynamically
  const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
  if (themeColorMetaTag) {
    if (theme === 'dark') {
      themeColorMetaTag.setAttribute('content', '#121212'); // Dark mode color
    } else {
      themeColorMetaTag.setAttribute('content', '#ffffff'); // Light mode color
    }
  }

  // Update the apple-mobile-web-app-status-bar-style for iOS
  const statusBarMetaTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (statusBarMetaTag) {
    if (theme === 'dark') {
      statusBarMetaTag.setAttribute('content', 'black-translucent');
    } else {
      statusBarMetaTag.setAttribute('content', 'default'); // Light mode default
    }
  }
}
