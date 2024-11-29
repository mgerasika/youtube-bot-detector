/* eslint-disable react/react-in-jsx-scope */
import {Statistic} from '../features/statistic';
import { Footer } from "@/features/footer";
import { Button } from "@/features/button";
import { getStatisticInfoAsync } from "@/api/get-statistic-info";
import { YouTubeEmbed } from "@/features/youtube-embeded";


export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 md:p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Statistic channelsCount={6262313} commentsCount={62153809} />
        <YouTubeEmbed videoId="Uhkx-RlRkMU" />
          <Button />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
     <Footer />
      </footer>
    </div>
  );
}

