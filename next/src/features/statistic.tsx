/** @jsxImportSource @emotion/react */
'use client'

import { IStatisticInfo } from "@/api.generated";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface IProps {
    commentsCount: number;
    channelsCount: number;
}
export function Statistic({commentsCount, channelsCount}: IProps) {
    const [statistic, setStatistic] = useState<IStatisticInfo | null>(null);

    const fetchStatisticWithTimeout = useCallback(() => {
          axios.get('/api/statistic/info')
              .then(response => {
                setStatistic(response.data)
                setTimeout(fetchStatisticWithTimeout, 60*1000)
              })
              .catch(() => setTimeout(fetchStatisticWithTimeout, 60*1000));
    }, []);

    useEffect(() => {
          fetchStatisticWithTimeout();
    }, [fetchStatisticWithTimeout]);

    return (
        <div className="text-center font-[family-name:var(--font-geist-mono)]">
            <h1 tw="md:text-5xl [font-size:28px] font-mono text-red-500 font-bold">Youtube Bot Detector</h1>
            <p tw="text-center">chrome додаток для пошуку ботів у youtube коментах</p>
            <p tw="mt-8 text-base">
                Уже оброблено більше ніж
                <strong>
                    &nbsp;{statistic?.comment.all_keys ? formatNumber(statistic.comment.all_keys) : formatNumber(commentsCount)}&nbsp;
                </strong>
                коментарів та
                <strong>
                    &nbsp;{statistic?.channel.all_keys ? formatNumber(statistic.channel.all_keys) : formatNumber(channelsCount)}&nbsp;
                </strong>
                каналів
            </p>
        </div>
    );
}

function formatNumber(number: number) {
    return new Intl.NumberFormat('en-US').format(number);
}
