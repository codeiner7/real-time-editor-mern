import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

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
    <div style={styles.container}>
      <h2 style={styles.heading}>Document Editor</h2>
      <textarea 
        value={content} 
        onChange={handleContentChange} 
        onSelect={handleCursorMove} 
        style={styles.textarea}
      />
      <button 
        onClick={() => socket.emit('saveDocument', { documentId: id, content })} 
        style={styles.button}
      >
        Save
      </button>
      <div style={styles.cursorContainer}>
        {Object.entries(cursors).map(([user, pos]) => (
          <div key={user} style={styles.cursor}>
            {user}: Position {pos}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  heading: {
    textAlign: 'center',
    fontSize: '20px',
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    height: '300px',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
    marginLeft: '-10px'
  },
  button: {
    display: 'block',
    margin: '10px auto',
    padding: '8px 12px',
    fontSize: '14px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '3px',
  },
  cursorContainer: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#555',
  },
  cursor: {
    backgroundColor: '#f3f3f3',
    padding: '5px',
    borderRadius: '3px',
  }
};

export default Editor;
