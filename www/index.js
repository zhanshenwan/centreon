import React from 'react'
import ReactDOM from 'react-dom'
import { TopHeader } from 'Components'

ReactDOM.hydrate(
  <TopHeader />,
  document.getElementById('header-react')
);
