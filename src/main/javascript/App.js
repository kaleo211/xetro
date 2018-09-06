import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board/Board';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import NewBoard from './components/board/NewBoard';
import Utils from './components/Utils';
import BoardActiveList from './components/board/BoardActiveList';

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
      team: null,
    };

    this.updateSelectedBoard = this.updateSelectedBoard.bind(this);
    this.updateSelectedTeam = this.updateSelectedTeam.bind(this);
    this.updatePage = this.updatePage.bind(this);

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }

  componentWillMount() {
    this.updateBoards(() => { });
    this.updateTeams(() => { });

    // console.log("fetching members");
    // Utils.fetchResource("members", (body => {
    //   let members = body._embedded.members;
    //   console.log("updated members:", members);
    //   this.setState({ members });
    // }));
  }

  updateBoards(callback) {
    // console.log("App# fetching boards");
    Utils.fetchResource("boards", (body => {
      let boards = body._embedded.boards;
      if (boards === null || boards.length === 0) {
        this.setState({ page: "newBoard" });
      } else if (boards.length === 0) {
        this.setState({ board: boards[0] });
        this.setState({ page: "" });
      } else {
        this.setState({ page: "activeBoards" });
      }
      this.setState({ boards }, callback(boards));
    }));
  }

  updatePage(page) {
    this.setState({ page });
    this.updateBoards(() => { });
  }

  updateSelectedBoard(boardID) {
    this.updateBoards((boards) => {
      boards.map(board => {
        if (board.id === boardID) {
          this.setState({ board, page: "" });
        }
      })
    });
  }

  updateTeams(callback) {
    console.log("fetching teams");
    Utils.fetchResource("teams", (body => {
      let teams = body._embedded.teams;
      this.setState({ teams }, callback(teams));
    }));
  }

  updateSelectedTeam(teamID) {
    this.state.teams.map(team => {
      if (team.id === teamID) {
        this.setState({ team });
        Utils.get(team._links.members.href, (body => {
          let members = body._embedded.members;
          console.log("#App# members after team selected:", members);
          this.setState({ members });
        }));
      }
    });
  }

  render() {
    const { members, board, teams, boards, team, page } = this.state;
    return (
      <div>
        <Board members={members} board={board} teams={teams} team={team} updateSelectedTeam={this.updateSelectedTeam} />

        <Dialog fullScreen open={page === "newBoard"} TransitionComponent={Transition} >
          <NewBoard members={members} teams={teams} updateSelectedBoard={this.updateSelectedBoard} updatePage={this.updatePage} />
        </Dialog>

        <Dialog fullScreen open={page === "activeBoards"} TransitionComponent={Transition} >
          <BoardActiveList boards={boards} updateSelectedBoard={this.updateSelectedBoard} updatePage={this.updatePage} />
        </Dialog>
      </div >
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('react')
)
