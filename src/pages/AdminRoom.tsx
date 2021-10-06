import {useHistory, useParams} from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { useRoom } from '../hooks/useRoom'
import deleteImg from '../assets/images/delete.svg'
import '../styles/room.scss'
import { ref, remove } from '@firebase/database'
import { db } from '../services/firebase'
import { update } from 'firebase/database'
type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    
    
    //const [newQuestion, setNewQuestion] = useState('');
    const {title, questions} = useRoom(roomId)
    
    async function handleEndRoom() {
        update(ref(db, `rooms/${roomId}`),{
            endedAt: new Date()
        }
)

        history.push('/')
    }

    async function handleDeleteQuestion(questionId : string){
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
            const questionRef = await remove(ref(db,`rooms/${roomId}/questions/${questionId}`))
        }
    }
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                    <RoomCode code={roomId}/>
                    <Button 
                    onClick={handleEndRoom}
                    isOutlined>Encerrar sala</Button>
                    </div>
                    
                </div>
            </header>
            <main className="content">
            <div className="room-title">
                <h1>Sala {title}</h1>
                {questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
            </div>
            <div className="question-list">
            {questions.map(question => {
                return (
                    <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    >
                        <button
                        type="button"
                        onClick={()=>{handleDeleteQuestion(question.id)}}
                        >
                            <img src={deleteImg} alt="Remover pergunta" />
                        </button>
                    </Question>
                )
            })}       
            </div>
           
            </main>
        </div>
    )
}