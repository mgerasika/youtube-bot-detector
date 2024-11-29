/** @jsxImportSource @emotion/react */
'use client'

import React from 'react'
import Image from "next/image";
export function Button() {

    return <a
        tw="mb-10"
        className="bg-[#ef3232] rounded-full border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#d02c2c] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href="https://chromewebstore.google.com/detail/youtube-bot-detector/lfllmjpfkkkaikjmppngmmlkcbildlcc"
        target="_blank"
        rel="noopener noreferrer"
    >
        <Image
            tw="fill-white"
            className="dark:invert"
            src="/download.svg"
            alt="Завантажити Youtube-Bot-Detector"
            width={20}
            height={20}
        />
        Завантажити у chrome store
    </a>




}

