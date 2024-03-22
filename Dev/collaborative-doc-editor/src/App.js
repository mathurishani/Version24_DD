// src/App.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './App.css';
import ReactQuill from 'react-quill';

const socket = io();

function App() {
    const [content, setContent] = useState('');

    useEffect(() => {
        socket.on('documentUpdated', (content) => {
            setContent(content);
        });

        return () => socket.disconnect();
    }, []);

    const handleContentChange = (newContent) => {
        setContent(newContent);
        socket.emit('updateDocument', newContent);
    };

    return (
        <div className="App">
            <ReactQuill
                theme="snow"
                value={content}
                onChange={handleContentChange}
            />
        </div>
    );
}

export default App;
