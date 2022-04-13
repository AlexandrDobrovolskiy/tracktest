import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('')
  const [id, setId] = useState( (Math.random() * 1000).toFixed(0));

  useEffect(() => {
    // window._rio.load();
    setTimeout(() => {
      // window._rio.subscribe();
    }, 2000);
    // window._rio.setId(id)
  }, []);

  const handleEmailChange = ({ target: { value } }) => {
    setEmail(value);
  };

  const handlePhoneChange = ({ target: { value } }) => {
    setPhone(value);
  };

  const handleIdChange = () => {
    const newId = (Math.random() * 1000).toFixed(0);
    setId(newId)
    window._rio.setId(newId)
  }

  const handleSubmit = () => {
    window._rio.identify({
      email,
      phone,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Retainly track test San
        </p>
        <button
          onClick={() => {
            window._rio.track("purchase", { product_id: Math.random() * 100 });
          }}
        >
          event
        </button>
        <div>Id: {id} <button onClick={handleIdChange}>change</button></div>
        <div>
          <input value={email} placeholder="Email" onChange={handleEmailChange} />
          <input value={phone} placeholder="Phone" onChange={handlePhoneChange} />
          <button onClick={handleSubmit}>login</button>
        </div>
      </header>
    </div>
  );
}

export default App;
