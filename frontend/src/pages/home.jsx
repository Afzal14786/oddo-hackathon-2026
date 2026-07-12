import { useState, useEffect } from 'react';

const Home = () => {
  const [samples, setSamples] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await getSamples();
      setSamples(res.data.data);
    } catch (error) {
      console.error('Error fetching samples:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createSample({ name: newName });
      setNewName('');
      fetchSamples(); // refresh list
    } catch (error) {
      console.error('Error creating sample:', error);
    }
  };

  return (
    <div>
      <h1>Oddo Hackathon 2026</h1>
      <h2>Samples</h2>
      <ul>
        {samples.map((item) => (
          <li key={item._id}>{item.name} (created at {new Date(item.createdAt).toLocaleString()})</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter sample name"
        />
        <button type="submit">Add Sample</button>
      </form>
    </div>
  );
};

export default Home;