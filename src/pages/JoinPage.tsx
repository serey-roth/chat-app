import React, { ReactNode, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = React.PropsWithChildren<{
    name: string;
    setName: (e: string) => void;
    children?: ReactNode;
}>;

const JoinPage = ({name, setName}: Props) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleJoin = useCallback(() => {
        if (name) {
            navigate('/chatroom') 
            setError('');
        } else {
            setError('Please enter your name before joining the chat!')
        }
    }, [name])

    return (
        <div className='flex flex-col gap-5 items-center'>
            <h1 className='text-3xl font-bold break-words'>Welcome to Chat.Room!</h1>
            <input type='text' placeholder='Enter your name'
            onChange={(e) => setName(e.target.value)} value={name}
            className='p-2 rounded-lg' />
            <button className='bg-slate-400 p-2 border-white border-2
            text-white rounded-lg' onClick={handleJoin}>Join</button>
            {error && (<p className='max-w-full text-red-500 font-italic'>{error}</p>)}
        </div>
    )
}

export default JoinPage