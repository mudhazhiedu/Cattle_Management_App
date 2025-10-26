import React, { useEffect, useState } from 'react';
import axios from './services/api';

function App() {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCows();
  }, []);

  async function fetchCows() {
    setLoading(true);
    try {
      const res = await axios.get('/cows');
      setCows(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Cattle Management</h1>
      <p>Backend API: {import.meta.env.VITE_API_URL}</p>
      {loading ? <p>Loading...</p> : (
        <table border="1" cellPadding="8">
          <thead>
            <tr><th>ID</th><th>Tag</th><th>Name</th><th>Breed</th></tr>
          </thead>
          <tbody>
            {cows.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.tag_id}</td>
                <td>{c.name}</td>
                <td>{c.breed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
