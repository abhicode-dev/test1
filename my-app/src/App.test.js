
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./Scripts/Script1', () => () => (
  <h1>Welcome to My script1 App</h1>
));

jest.mock('./Scripts/Script2', () => () => (
  <h1>Welcome to My Script 2 App</h1>
));

test('renders Script1 by default', () => {
  render(<App />);

  expect(
    screen.getByText('Welcome to My script1 App')
  ).toBeInTheDocument();
});

test('renders Script2 when selected', () => {
  // The environment variable is read when App is rendered.
  process.env.REACT_APP_SELECTED_SCRIPT = 'Script2';

  jest.resetModules();
  const { default: AppWithScript2 } = require('./App');

  render(<AppWithScript2 />);

  expect(
    screen.getByText('Welcome to My Script 2 App')
  ).toBeInTheDocument();

  delete process.env.REACT_APP_SELECTED_SCRIPT;
});