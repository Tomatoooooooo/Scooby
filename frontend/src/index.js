import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import theme from './theme';
import { ChakraProvider, ColorModeScript,extendTheme } from '@chakra-ui/react'

ReactDOM.render(
  <ChakraProvider theme={extendTheme({ config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  } })}>
  <React.StrictMode>
  <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
);