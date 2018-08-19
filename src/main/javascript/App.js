import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App" >
        <header className="App-header" >
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title" > Welcome to React </h1>
        </header >
        <p className="App-intro" >To get started, edit < code > src / App.js </code> and save to reload. </p >
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
)
