function injectCSS(url: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

function injectJS(url: string): void {
  const script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
}

function injectDependencies(dependencies: { css?: string[], js?: string[] }): void {
  if (dependencies.css) {
    dependencies.css.forEach(url => injectCSS(url));
  }

  if (dependencies.js) {
    dependencies.js.forEach(url => injectJS(url));
  }
}

const SK = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/socket.io/socket.io.js'
  : 'https://amethyst.norelock.dev/_/socket.io/socket.io.min.js';

const dependencies = {
  js: [
    SK
  ],
  css: [

  ],
};

export { injectCSS, injectJS, dependencies, injectDependencies };