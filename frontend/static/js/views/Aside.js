export default class Aside {
  render() {
    return `
      <aside>
        <a href="/" data-link>
          <div class="logo">
            <span class="circle"></span>
          </div>
        </a>

        <div class="down">
          <div class="theme">
            <img src="/static/imgs/icon-${localStorage.theme === 'dark' ? 'sun' : 'moon'}.svg" alt="theme" />
          </div>

          <div class="user">
            <img src="/static/imgs/user.webp" alt="user" />
          </div>
        </div>
      </aside>
    `;
  }
}

window.addEventListener('load', () => {
  window.addEventListener('click', (e) => {
    if (e.target.matches('div.theme > img')) {
      let htmlElement = document.documentElement,
        hasAttribute = htmlElement.getAttribute('data-theme');

      hasAttribute === 'dark' ? setTheme('light', e.target) : setTheme('dark', e.target);
    }
  });

  function setTheme(theme, icon) {
    document.documentElement.setAttribute('data-theme', theme);
    icon.src = `/static/imgs/icon-${theme === 'dark' ? 'sun' : 'moon'}.svg`;
    localStorage.setItem('theme', theme);
  }
});