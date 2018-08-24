import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/Board';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Board />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
)
