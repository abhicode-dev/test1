import Script1 from './Scripts/Script1';
import Script2 from './Scripts/Script2';

function App() {
  const selectedScript =
    process.env.REACT_APP_SELECTED_SCRIPT || 'Script1';

  return selectedScript === 'Script2'
    ? <Script2 />
    : <Script1 />;
}

export default App;