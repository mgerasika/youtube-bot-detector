import Image from "next/image";
import {Statistic} from '../features/statistic';
import { SocialIcon } from "react-social-icons";
import { Footer } from "@/features/footer";
import { Button } from "@/features/button";
import { GetStaticProps } from "next";
import axios from "axios";
import { IStatisticInfo } from "@/api.generated";
import { getStaticProps } from "next/dist/build/templates/pages";
import { ENV } from "../../env";
import { getStatisticInfoAsync } from "@/api/get-statistic-info";
import { YouTubeEmbed } from "@/features/youtube-embeded";

interface IProps {
  commentsCount: number;
  channelsCount: number;
}
export default async function Home() {
  const {channelsCount, commentsCount} = await getStatisticInfoAsync();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 md:p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Statistic channelsCount={channelsCount} commentsCount={commentsCount} />
        <YouTubeEmbed videoId="Uhkx-RlRkMU" />
          <Button />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
     <Footer />
      </footer>
    </div>
  );
}

