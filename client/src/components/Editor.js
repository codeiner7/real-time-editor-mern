import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8000');

const Editor = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [cursors, setCursors] = useState({});
  const username = localStorage.getItem('username');

  useEffect(() => {
    socket.emit('joinDocument', id, username);

    socket.on('loadDocument', (data) => setContent(data));
    socket.on('receiveChanges', (newContent) => setContent(newContent));
    socket.on('updateCursors', (cursorData) => setCursors(cursorData));

    return () => {
      socket.off('loadDocument');
      socket.off('receiveChanges');
      socket.off('updateCursors');
    };
  }, [id]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit('sendChanges', { documentId: id, content: newContent });
  };

  const handleCursorMove = (e) => {
    const cursorPos = e.target.selectionStart;
    socket.emit('cursorMove', { documentId: id, username, cursorPos });
  };

  return (
    <div className="editor">
      <h2>Document Editor</h2>
      <textarea value={content} onChange={handleContentChange} onSelect={handleCursorMove} />
      <button onClick={() => socket.emit('saveDocument', { documentId: id, content })}>Save</button>
      <div className="cursors">
        {Object.entries(cursors).map(([user, pos]) => (
          <div key={user} className="cursor">
            {user}: Position {pos}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Editor;
