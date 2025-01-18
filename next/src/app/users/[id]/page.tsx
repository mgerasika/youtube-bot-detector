/* eslint-disable react/react-in-jsx-scope */

import { ICommentDto, IStatisticByChannel } from "@/api.generated";
import { unstable_cache } from "next/cache";
import { preload } from "react-dom";

const getCommentsByAuthorId = (id:string) => unstable_cache(
    async () => {
      return await fetch('http://192.168.0.16:8077/api/comment?author_id=' + id,{cache: 'force-cache',}).then((res) =>
        res.json()
      )
    },
    [`getCommentsByAuthorId-${id}`],
    { revalidate: 3600, tags: [`getCommentsByAuthorId-${id}`] }
  )();

  const getStatisticByChannel = (id:string) => unstable_cache(
    async () => {
      return await fetch('http://192.168.0.16:8077/api/statistic/by-channel-detailed?channel_id=' + id,{cache: 'force-cache',}).then((res) =>
        res.json()
      )
    },
    [`getStatisticByChannel-${id}`],
    { revalidate: 3600, tags: [`getStatisticByChannel-${id}`] }
  )();
  
export default async function UserPage({params}:{params:{id:string}}) {
    const comments: ICommentDto[] = await getCommentsByAuthorId(params.id)
    // const statistic: IStatisticByChannel[] = await getStatisticByChannel(params.id)

  return (
    <pre>
      {/* {JSON.stringify(statistic,null,2)} */}
      {JSON.stringify(comments,null,2)}
    </pre>
  );
}


 
