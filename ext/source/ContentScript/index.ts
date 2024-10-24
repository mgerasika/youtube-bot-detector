/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {style} from './style';
import { ENV } from '../env';
import axios from 'axios';
import { IStatisticInfo } from '../api.generated';
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
  iconDiv.innerHTML = "";
  div.appendChild(iconDiv);
  return div; 
}


function getChannelUrl() : string | undefined {
const container = document.querySelector("ytd-channel-name[id='channel-name']")
if(container) {
  const link  = container.querySelector("a")
  if(link) {
    return link.href.split('/').pop();
  }

}
return undefined
}

function getChannelId() {
  const container = document.querySelector("div[id='social-links']")
  if(container) {
    const link  = container.querySelector("a")
    if(link) {
      const href = link.href.replace('/videos', '')
      return href.split('/').pop();
    }
  
  }
  return undefined
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

function getAuthorUrl(el: HTMLElement): string | undefined {
  const linkElement = el.querySelector("a[id=author-text]");
  if(linkElement && linkElement.getAttribute) {
    const id = linkElement?.getAttribute("href")?.replace("/channel/", "");
    return id ? id.replace('/@','@') : undefined;
  }
  return undefined;
}

function findStatisticItem(el: HTMLElement): IStatisticInfo | undefined {
  const authorUrl = getAuthorUrl(el);
  if(authorUrl) {
    const statisticItem = _statisticByVideo.find(stat => stat.author_url === authorUrl);
    return statisticItem;
  }
  return undefined;
}
function updateState(el: HTMLElement, botDiv: HTMLElement) {
  const statisticItem = findStatisticItem(el);
  const toolbar = el.querySelector("div[id=toolbar]");
  const [likeBtn, dislikeBtn, authorLikedBtn] = toolbar?.getElementsByTagName("button") || [];
  if(likeBtn?.getAttribute("aria-pressed") === "true") {
    if(botDiv.childNodes[0]) {
      (botDiv.childNodes[0] as HTMLElement).innerHTML = 'Liked';
    }
  }
  if(dislikeBtn?.getAttribute("aria-pressed") === "true") {
    if(botDiv.childNodes[0]) {
      (botDiv.childNodes[0] as HTMLElement).innerHTML = 'Disliked';
    }
  }
  if(authorLikedBtn?.getAttribute("aria-label") === "Heart") {
    // botDiv.childNodes[0].innerHTML = 'Author Liked';
  }

  if(statisticItem) {
    if(botDiv.childNodes[0]) {
      (botDiv.childNodes[0] as HTMLElement).innerHTML = `${statisticItem.comment_count}`
    }
  }
};

let _statisticByVideo: IStatisticInfo[] = [];
let _statisticByChannel: IStatisticInfo[] = [];
function load() {
 
  const rootElements = getRootElements();
  if(rootElements.length) {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const videoId = params.get('v');
    console.log('videoId', videoId)

    const channelUrl = getChannelUrl();
      console.log('channelUrl',channelUrl)

      const channelId = getChannelId();
      console.log('channelId',channelId)

    axios.get(`${ENV.next_server_url}api/scan/by-video?video_id=${videoId}`).then(statistic => {
      _statisticByVideo = statistic.data;
      console.log('statistic by video', _statisticByVideo)

      render()
    })

    axios.get(`${ENV.next_server_url}api/scan/by-channel?channel_id=${channelId}`).then(statistic => {
      _statisticByChannel = statistic.data;
      console.log('statistic by channel', _statisticByChannel)

      render()
    })
 
   
  }
  else {
    window.setTimeout(load,50);
  }
}

load();
console.log('plugin started')
document.body.appendChild(style);
export {};