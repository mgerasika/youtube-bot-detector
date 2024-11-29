/* eslint-disable react/react-in-jsx-scope */
/** @jsxImportSource @emotion/react */
'use client'

import { IStatisticInfo } from "@/api.generated";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import 'twin.macro'

interface IProps {
    commentsCount: number;
    channelsCount: number;
}
export function Statistic({commentsCount, channelsCount}: IProps) {
    const { t } = useTranslation('common');

    return (
        <div className="text-center font-[family-name:var(--font-geist-mono)]">
            <h1 tw="md:text-5xl [font-size:28px] font-mono text-red-500 font-bold">Youtube Bot Detector</h1>
            <p tw="text-center">chrome додаток для пошуку ботів у youtube коментах з використанням ШІ (<a target="blank" tw="text-blue-700" href="https://perspectiveapi.com/">Perspective API</a>)</p>
            <p tw="mt-8 text-base">
                Уже оброблено більше ніж
                <strong>
                    &nbsp;{ formatNumber(commentsCount)}&nbsp;
                </strong>
                коментарів та
                <strong>
                    &nbsp;{formatNumber(channelsCount)}&nbsp;
                </strong>
                каналів
            </p>
        </div>
    );
}

function formatNumber(number: number) {
    return new Intl.NumberFormat('en-US').format(number);
}
