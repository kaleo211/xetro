import React from 'react';
import ReactDOM from 'react-dom';
import Body from './components/Body';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Body />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
)
