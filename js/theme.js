export function detectSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  const elementsToUpdate = [
    document.body,
    document.querySelector('.header'),
    document.querySelector('#typing-indicator'),
    document.querySelector('#logout-button'),
    document.querySelector('#go-back'),
    document.querySelector('.container'),
    document.querySelector('.messages'),
    document.querySelector('.input-area'),
    ...document.querySelectorAll('.login-register'),
    ...document.querySelectorAll('.message')
  ];

  elementsToUpdate.forEach(element => {
    if (element) {
      if (theme === 'dark') {
        element.classList.add('dark-theme');
      } else {
        element.classList.remove('dark-theme');
      }
    }
  });

  const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
  if (themeColorMetaTag) {
    themeColorMetaTag.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
  }

  localStorage.setItem("theme", theme);
}

export function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const theme = savedTheme || detectSystemTheme();
  applyTheme(theme);
}
