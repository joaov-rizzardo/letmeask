import { onValue, ref } from "@firebase/database"
import { useEffect, useState } from "react"
import { db } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string,{
        authorId: string;
    }>
}>

export function useRoom (roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const { user } = useAuth();

    useEffect(()=>{
        const roomRef = ref(db, `rooms/${roomId}`)
        onValue(roomRef,room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions  ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content : value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key,like]) => like.authorId === user?.id)?.[0]

                }
            })
            
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

    }, [roomId, user?.id])
    return {questions, title}
}