import { useCallback, useEffect, useState } from "react";
import { getCommentElements } from "../utils/get-comment-elements.util";
import { useScroll } from "./use-scroll.hook";
import { useDelay } from "./use-delay.hook";

interface IReturn {
    comments: HTMLElement[];
    rescan: (parent: HTMLElement) => void;
}
export const useGetComments = (): IReturn => {
    const [comments,setComments] = useState<HTMLElement[]>([]);
  
    const updateCommentsWithDelay = useDelay(() => {
        setComments( getCommentElements());
      }, 400); 

    const handleScroll = useCallback(() => {
       updateCommentsWithDelay();
    }, [updateCommentsWithDelay])

   useScroll({onScroll: handleScroll});

  
  
    useEffect(() => {
        setComments( getCommentElements());
    }, [])

    return {
        comments,
        rescan: useCallback(( _parent: HTMLElement) => {
            updateCommentsWithDelay();
        },[updateCommentsWithDelay])
    };
}
