/** @jsxImportSource @emotion/react */
'use client'

import { SocialIcon } from 'react-social-icons'

export function Footer() {

  return <div tw="flex gap-4 p-1 justify-center">
    <SocialIcon network="telegram" target="_blank" url="https://t.me/youtubebotdetector" />
    <SocialIcon network="youtube" target="_blank" url="https://www.youtube.com/@youtube-bot-detector" />
    <SocialIcon network="facebook" target="_blank" url="https://www.facebook.com/share/1AR2D3fAQN/" />
    <SocialIcon network="email" target="_blank" url="mailto:alta.romeo@gmail.com?subject=youtube-bot-detector" />
  </div>



}

