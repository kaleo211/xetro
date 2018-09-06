import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board/Board';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import NewBoard from './components/board/NewBoard';
import Utils from './components/Utils';

const styles = theme => ({
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "",
      members: [],
      board: null,
      boards: [],
      teams: [],
    };

    this.updateSelectedBoard = this.updateSelectedBoard.bind(this);
    this.updatePage = this.updatePage.bind(this);

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }

  componentWillMount() {
    console.log("fetching members");
    Utils.fetchResource("members", (body => {
      let members = body._embedded.members;
      console.log("updated members:", members);
      this.setState({ members });
    }));

    this.updateBoards((boards) => {
      if (boards === null || boards.length === 0) {
        this.setState({ page: "newBoard" });
      } else {
        this.setState({ board: boards[0] });
      }
    });

    Utils.fetchResource("teams", (body => {
      let teams = body._embedded.teams;
      console.log("updated teams:", teams);
      this.setState({ teams });
    }));
  }

  updateBoards(callback) {
    console.log("fetching boards");
    Utils.fetchResource("boards", (body => {
      let boards = body._embedded.boards;
      this.setState({ boards }, callback(boards));
    }));
  }

  updatePage(page) {
    this.setState({ page });
  }

  updateSelectedBoard(idx) {
    this.updateBoards((boards) => {
      this.setState({ board: boards[idx] });
    });
  }

  render() {
    const { members, board, teams } = this.state;
    return (
      <div>
        <Board members={members} board={board} />

        <Dialog
          fullScreen
          open={this.state.page === "newBoard"}
          onClose={this.handleSetupPageClose}
          TransitionComponent={Transition}
        >
          <NewBoard members={members} teams={teams} updateSelectedBoard={this.updateSelectedBoard} updatePage={this.updatePage} />
        </Dialog>
      </div >
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
)
