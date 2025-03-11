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

  return (
    <div className="dashboard">
      <h2>My Documents</h2>

      <div>
        <input
          type="text"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createDocument}>Create Document</button>
      </div>

      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            <span>{doc.title}</span>
            <button onClick={() => navigate(`/editor/${doc._id}`)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
