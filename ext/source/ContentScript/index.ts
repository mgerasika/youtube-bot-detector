/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {style} from './style';
import { renderReactApp } from './App';
import { getChannelUrl } from './utils/get-channel-url.util';
import { getVideoId } from './utils/get-video-id.util';



function load() {
  if(getChannelUrl() && getVideoId() ) {
    renderReactApp();
  }
  else {
    window.setTimeout(load,50);
  }
}

load();
document.body.appendChild(style);

export {};