import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/documents/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents', error);
    }
  };

  const createDocument = async () => {
    if (!title) return;
    try {
      const { data } = await axios.post(
        'http://localhost:8000/documents/create',
        { title },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDocuments([data, ...documents]);
      setTitle('');
    } catch (error) {
      console.error('Error creating document', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>My Documents</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <button onClick={createDocument} style={styles.button}>Create</button>
      </div>

      <ul style={styles.list}>
        {documents.map((doc) => (
          <li key={doc._id} style={styles.listItem}>
            <span>{doc.title}</span>
            <button onClick={() => navigate(`/editor/${doc._id}`)} style={styles.editButton}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '20px auto',
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  heading: {
    fontSize: '20px',
  },
  logoutButton: {
    padding: '6px 12px',
    fontSize: '14px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '3px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginRight: '10px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '14px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '3px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  editButton: {
    padding: '5px 10px',
    fontSize: '12px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '3px',
  },
};

export default Dashboard;
