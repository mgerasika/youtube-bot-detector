import {  useState, useCallback } from "react";
import { useIndexedDB } from "./use-index-db.hook";
import { IChannel } from "../interfaces/channel.interface";

export function useChannelIndexedDB() {
  const { addDataAsync: addData, getDataAsync: getData, deleteDataAsync: deleteData, error, isConnected } = useIndexedDB<IChannel>({
    dbName: "YoutubeBotDetector",
    storeName: "channels",
    keyPath: "channelUrl",
  });

  const [channel, setChannel] = useState<IChannel | null | undefined>(undefined);

  // Function to add a user to IndexedDB
  const addChannel = useCallback(
    (channelData: IChannel) => {
      addData(channelData);
    },
    [addData]
  );

  // Function to fetch a user from IndexedDB by ID
  const fetchChannel = useCallback(
     (channelUrl: string) => {
      getData(channelUrl).then(fetchedUser => {
        setChannel(fetchedUser || null)
      });
    },
    [getData]
  );

  // Function to delete a user from IndexedDB by ID
  const removeChannel = useCallback(
    async (channelUrl: string) => {
      await deleteData(channelUrl);
      setChannel(null);
    },
    [deleteData]
  );

 
  return {  channel, addChannel,  fetchChannel,  removeChannel, error, isConnected };
}
