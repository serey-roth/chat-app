import { useState, useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'

import JoinPage from './pages/JoinPage'
import ChatRoom from './pages/ChatRoom'

function App() {
    const [name, setName] = useState('');

    return (
        <div className='bg-slate-500/50 min-h-screen flex flex-col
        items-center justify-center'>
            <Routes>
                <Route path='/' element={<JoinPage name={name} setName={setName} />} />
                <Route path='/chatroom' element={<ChatRoom name={name} />} />
            </Routes>
        </div>
    )
}

export default App
