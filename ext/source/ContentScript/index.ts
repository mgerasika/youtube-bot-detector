/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {style} from './style';
import { getCommentElements } from './utils/get-comment-elements.util';
import { renderReactApp } from './App';

let timeoutRes = 0;
window.addEventListener("scroll", () => {
  window.clearTimeout(timeoutRes);
  timeoutRes = window.setTimeout(() => {
    // render();
  }, 50);
});

function load() {
  const comments = getCommentElements();
  if(comments.length) {
    renderReactApp();
  }
  else {
    window.setTimeout(load,50);
  }
}

load();
document.body.appendChild(style);

export {};