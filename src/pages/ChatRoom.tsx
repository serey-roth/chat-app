import { useState, ReactNode, useCallback, useEffect } from 'react'

interface Props {
    children?: ReactNode;
    name: string;
}

export interface ChatData {
    id?: number | string | undefined;
    user: string | undefined;
    msg: string | undefined;
}

export type Data = number | ChatData | undefined;


const isChatData = (data: Data): data is ChatData => {
    if (!data) return false;
    return (data as ChatData).user !== undefined;
}

const ChatRoom: React.FC<Props> = ({ name }) => {
    const [message, updateMessage] = useState('');
    const [log, updateLog] = useState('');
    const [ws, updateWS] = useState<WebSocket | undefined>();
    const [data, setData] = useState<Data>()

    const showMessage = useCallback((user: string | undefined, message: string | undefined) => {
        updateLog(prev => prev + `${prev === '' ? '' : '\n'}${user}: ${message}`);
        updateMessage('');
    }, [])
   
    const handleClick = useCallback(() => {
        console.log(message)
        if (!ws) {
            console.log('no websocket connection!');
            return;
        }
        if (!message) {
            return;
        }
        ws.send(JSON.stringify({
            user: name,
            msg: message,
        }));
        showMessage(name, message)
    }, [ws, message])

    useEffect(() => {
        if (isChatData(data)) {
            showMessage(data.user, data.msg)
        }
    }, [data]);

    useEffect(() => {
        if (ws instanceof WebSocket) {
            ws.onopen = ws.onclose = null;
            ws.close();
        }
        else {
            let socket = new WebSocket('ws://localhost:8008');
    
            socket.onopen = () => {
                console.log('Connection opened!');
            }
        
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                setData(data)
            }
        
            socket.onclose = () => socket.close();

            updateWS(socket);
        }
        return () => {
            if (ws instanceof WebSocket) {
                ws.onopen = ws.onclose = null;
                ws.close();
            }
            updateWS(undefined);
        }
    }, [])

    return (
        <div className='flex flex-col gap-3 min-h-screen
        w-full p-4 absolute inset-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px]'>
            <span className='flex flex-row w-full items-center'>
                <h1 className='text-3xl font-bold flex-1'>Chat Room</h1>
                <p className='text-lg self-end'>User: {name}</p>
            </span>
            {(typeof data === 'number') && (<p>{data} people online</p>)}
            <pre className='flex-1 overflow-auto 
            bg-white p-2 rounded-lg'>{log}</pre>
            <input type="text" placeholder="Type your message" value={message}
            onChange={(e) => {
                updateMessage(e.target.value)
            }}
            className='p-2 rounded-lg'/>
            <button className='bg-slate-400 p-2 border-white border-2
            text-white rounded-lg' onClick={handleClick}>Send message</button>
        </div>
    )
}

export default ChatRoom