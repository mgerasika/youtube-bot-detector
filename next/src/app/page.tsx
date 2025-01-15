/* eslint-disable react/react-in-jsx-scope */
import {Statistic} from '../features/statistic';
import { Footer } from "@/features/footer";
import { Button } from "@/features/button";
import { YouTubeEmbed } from "@/features/youtube-embeded";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

 export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;


  // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
  // const { t } = useTranslation('common', { i18n: (translations as any).i18n });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 md:p-8 pb-20 font-[family-name:var(--font-geist-sans)]">

{/* <h1>{t('greeting')}</h1>
<p>{t('welcome_message')}</p> */}

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
