import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [pingInterval, setPingInterval] = useState('');
  const [gaID, setGaID] = useState('');
  const [id, setId] = useState( (Math.random() * 1000).toFixed(0));

  const handlePingIntervalChange = ({ target: { value } }) => {
    setPingInterval(+value);
  };

  const handleGAIDChange = ({ target: { value } }) => {
    setGaID(value);
  };

  const handleIdChange = () => {
    const newId = (Math.random() * 1000).toFixed(0);
    setId(newId)
    window._rio.setId(newId)
  }

  const handleSubmit = () => {
    window._rio.init({
      ping_interval: pingInterval,
      gaMeasurementId: gaID,
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Retainly track test
        </p>
        <button
          onClick={() => {
            window._rio.track("purchase", { product_id: Math.random() * 100 });
          }}
        >
          event
        </button>
        <button
          onClick={() => {
            window._rio.startSession();
          }}
        >
          start session
        </button>
        <button
          onClick={() => {
            window._rio.endSession();
          }}
        >
          end session
        </button>
        <button
          onClick={() => {
            window._rio.subscribe();
          }}
        >
          subscribe
        </button>
        <div>Id: {id} <button onClick={handleIdChange}>change</button></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input value={pingInterval} placeholder="Ping interval" onChange={handlePingIntervalChange} />
          <input value={gaID} placeholder="GA ID" onChange={handleGAIDChange} />
          <button onClick={handleSubmit}>Reinit</button>
        </div>
      </header>
    </div>
  );
}

export default App;
