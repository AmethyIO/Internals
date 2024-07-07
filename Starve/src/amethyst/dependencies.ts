import { globalObject } from "@/core/utils";

export function injectCSS(url: string): void {
  const link = globalObject.document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;

  globalObject.document.head.appendChild(link);
}

export function injectJS(url: string): void {
  const script = globalObject.document.createElement('script');
  script.src = url;
  script.onload = () => console.log('dependency', script.src, 'loaded');

  globalObject.document.head.appendChild(script);
}

export function injectDependencies(dependencies: { css?: string[], js?: string[] }): void {
  if (dependencies.js && dependencies.js.length > 0) dependencies.js.forEach(url => injectJS(url));
  if (dependencies.css && dependencies.css.length > 0) dependencies.css.forEach(url => injectCSS(url));
}

export const dependencies = {
  'js': [
    'https://amethyst.norelock.dev/socket.io/socket.io.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.js'
  ],
  'css': [

  ],
};