/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {style} from './style';
let timeoutRes = 0;
window.addEventListener("scroll", () => {
  window.clearTimeout(timeoutRes);
  timeoutRes = window.setTimeout(() => {
    render();
  }, 50);
});

function getBotDiv() {
  const div = document.createElement("div");
  div.className = 'botDiv';
  const iconDiv = document.createElement("div");
  iconDiv.className = "iconDiv";
  iconDiv.innerHTML = "Bot";
  div.appendChild(iconDiv);
  return div; 
}
function getRootElements() {
  const rootElements: any[] = document.body.getElementsByTagName(
    "ytd-comment-thread-renderer"
  ) as unknown as [];
  return rootElements;
}
function render() {
 
  const rootElements = getRootElements();
  const botDiv = getBotDiv();

  // axios.get("http://localhost:8005/api/movie/");
  for (let i = 0; i < rootElements.length; i++) {
    const el = rootElements[i];

    if(!el.className?.includes('iconDivContainer')) {
      const linkElement = el.querySelector("a[id=author-text]");
      const id = linkElement.getAttribute("href").replace("/channel/", "");
      console.log("id", id);
      el.className = 'iconDivContainer ' + el.className;
      const cloneBotDiv = botDiv.cloneNode(true) as HTMLElement;
      updateState(el, cloneBotDiv);
      el.appendChild(cloneBotDiv);
      el.addEventListener("click", render);
    }
    else {
      updateState(el,  el.querySelector(".botDiv"))
    }
    
  }
}

function updateState(el: HTMLElement, botDiv: HTMLElement) {
  const toolbar = el.querySelector("div[id=toolbar]");
  const [likeBtn, dislikeBtn, authorLikedBtn] = toolbar?.getElementsByTagName("button") || [];
  if(likeBtn?.getAttribute("aria-pressed") === "true") {
    botDiv.childNodes[0].innerHTML = 'Liked';
  }
  if(dislikeBtn?.getAttribute("aria-pressed") === "true") {
    botDiv.childNodes[0].innerHTML = 'Disliked';
  }
  if(authorLikedBtn.getAttribute("aria-label") === "Heart") {
    // botDiv.childNodes[0].innerHTML = 'Author Liked';
  }
};

function load() {
  const rootElements = getRootElements();
  if(rootElements.length) {
    render()
  }
  else {
    window.setTimeout(load,50);
  }
}

load();
document.body.appendChild(style);
export {};