import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import MemberList from './components/MemberList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <MemberList />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
)
