import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import deepPurple from '@material-ui/core/colors/deepPurple';
import IconButton from '@material-ui/core/IconButton';

import Board from './components/board/Board';
import BoardActiveList from './components/board/BoardActiveList';
import NewBoard from './components/board/NewBoard';
import Utils from './components/Utils';
import Timer from './components/Timer';
import BarSettings from './components/BarSettings';
import TeamMenu from './components/TeamMenu';
import MemberMenu from './components/MemberMenu';

import {
  Add,
  Done,
  KeyboardRounded,
} from '@material-ui/icons';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: 82,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 1,
    minWidth: 0,
  },
  toolbar: theme.mixins.toolbar,
  purpleAvatar: {
    color: '#fff',
    backgroundColor: deepPurple[300],
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "",
      members: [],
      allMembers: [],
      board: null,
      boards: [],
      teams: [],
      team: null,
      snackbarMessage: "",
      snackbarOpen: false,
      selectedMember: null,
    };

    this.updateSelectedBoard = this.updateSelectedBoard.bind(this);
    this.updateSelectedTeam = this.updateSelectedTeam.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleBoardUnlock = this.handleBoardUnlock.bind(this);
    this.handleBoardLock = this.handleBoardLock.bind(this);

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }

  componentWillMount() {
    document.body.style.margin = 0;

    this.updateTeams(() => { });
    this.updateAllMembers();
  }

  updateAllMembers() {
    Utils.fetchResource("members", (body => {
      let allMembers = body._embedded.members;
      console.log("#App# fetched all members:", allMembers);
      this.setState({ allMembers });
    }));
  }


  handleSnackbarClose() {
    this.setState({ snackbarOpen: false })
  }

  handleSnackbarOpen(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
    });
  }

  updateSelectedMember(member) {
    this.setState({ selectedMember: member });
  }

  addMemberToTeam(memberID) {
    let teamMember = {
      team: Utils.appendLink("teams/" + this.state.team.id),
      member: Utils.appendLink("members/" + memberID),
    }
    Utils.postTeamMember(teamMember, (body => {
      console.log("#App# returned posted association:", body);
      this.updateSelectedTeam(this.state.team.id);
    }));
  }

  updatePage(page) {
    this.setState({ page });
    this.updateBoards(() => { });
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

        // Fetch all members of this team
        Utils.fetchResource("teamMember/team/" + teamID, (body => {
          let members = body._embedded.members;
          // console.log("#App# members after team selected:", members);
          this.setState({ members });
        }));

        // Fetch all active boards belongs to this team
        this.updateActiveBoardsByTeam(teamID);
      }
    });
  }

  updateActiveBoardsByTeam(teamID) {
    Utils.fetchResource("boards/active/team/" + teamID, (body => {
      let boards = body && body._embedded && body._embedded.boards || [];
      console.log("boards:", boards);
      if (boards.length === 0) {
        this.setState({
          board: null,
          boards,
          page: ""
        });
      } else if (boards.length === 1) {
        let board = boards[0];
        console.log("#App# fetched board by team:", board);

        this.setState({
          board,
          page: "board",
          team: board.team,
          selectedMember: board.facilitator,
        });
      } else {
        this.setState({ board: null, page: "activeBoards" });
      }
      this.setState({ boards });
    }));
  }

  updateSelectedBoard(boardID) {
    Utils.fetchResource("boards/" + boardID, (body => {
      let board = body;
      console.log("#App# fetched board by id:", board);
      this.setState({
        board,
        page: "board",
        team: board._embedded.team,
        selectedMember: board.facilitator,
      });
    }));
  }

  updateActiveBoards(callback) {
    // console.log("App# fetching boards");
    Utils.fetchResource("boards/active", (body => {
      let boards = body._embedded.boards || [];
      if (boards.length === 0) {
        this.setState({ board: null, page: "" });
      } else if (boards.length === 1) {
        this.updateSelectedBoard(boards[0].id);

      } else {
        this.setState({ board: null, page: "activeBoards" });
      }
      this.setState({ boards }, callback(boards));
    }));
  }

  updateBoard(updatedBoard) {
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      this.setState({ board: Utils.reformBoard(body) });
    }));
  }

  handleBoardLock() {
    let updatedBoard = { locked: true };
    this.updateBoard(updatedBoard);
    this.handleSnackbarOpen("Board is LOCKED.")
  }

  handleBoardDone() {
    let updatedBoard = { finished: true };
    this.updateBoard(updatedBoard);
    this.handleSnackbarOpen("Board is ARCHIVED.");
  }

  handleBoardUnlock() {
    let updatedBoard = { locked: false };
    this.updateBoard(updatedBoard);
    this.handleSnackbarOpen("Board is UNLOCKED.");
  }

  handleBoardFinished() {
    let updatedBoard = { finished: true };
    Utils.patchResource(this.state.board, updatedBoard, (() => {
      this.handleSnackbarOpen("Board is FINISHED.");
      this.setState({
        page: "",
        board: null,
      });
    }));
  }

  handleBoardAdd() {
    this.setState({ page: "newBoard" });
  }

  render() {
    const { members, board, teams, boards, team, page, selectedMember, allMembers } = this.state;
    const { classes } = this.props;
    console.log("page:", page, "team", team);
    return (<div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <Typography variant="title" color="inherit" noWrap style={{ flexGrow: 1 }}>
            {board && board.name && board.name.toUpperCase()}
          </Typography>

          <div style={{ flexGrow: 1 }}>
            {/* {board && board.started && !board.finished && <Timer board={board} />} */}
          </div>

          <BarSettings board={board} handleBoardLock={this.handleBoardLock}
            handleBoardUnlock={this.handleBoardUnlock} />
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
        <div className={classes.toolbar} />
        <div style={{ marginTop: 8 }}>
          <TeamMenu team={team} teams={teams} updateSelectedTeam={this.updateSelectedTeam} />
        </div>
        <List component="nav" style={{ marginLeft: -6 }}>
          {members.map(member => (
            <ListItem key={"side" + member.userID} button
              onClick={this.updateSelectedMember.bind(this, member)}
              style={{ paddingTop: 16, paddingBottom: 16 }}
            >
              <ListItemAvatar>
                {selectedMember && selectedMember.userID === member.userID ? (
                  <Badge badgeContent={(<KeyboardRounded />)}>
                    <Avatar className={board && board.facilitator && board.facilitator.userID === member.userID ? classes.purpleAvatar : null}>{member.userID}</Avatar>
                  </Badge>
                ) : (<Avatar className={board && board.facilitator && board.facilitator.userID === member.userID ? classes.purpleAvatar : null}>{member.userID}</Avatar>)}
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
        <div style={{ marginLeft: 13 }}>
          <MemberMenu members={allMembers} team={team} addMemberToTeam={this.addMemberToTeam.bind(this)} />
        </div>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === "board" && (
          <Board board={board} teams={teams} team={team}
            members={members} selectedMember={selectedMember}
            updateSelectedTeam={this.updateSelectedTeam} />
        )}
        {page === "newBoard" && (
          <NewBoard members={members} team={team} updatePage={this.updatePage}
            updateSelectedBoard={this.updateSelectedBoard} />
        )}
        {page === "activeBoards" && (
          <BoardActiveList boards={boards} updatePage={this.updatePage}
            updateSelectedBoard={this.updateSelectedBoard} />
        )}
      </main>

      {team && (<div>
        {page === "" && <Button variant="fab" className={classes.fab}
          onClick={this.handleBoardAdd.bind(this)}>
          {<Add />}
        </Button>}
        {page === "board" && <Button variant="fab" className={classes.fab}
          onClick={this.handleBoardFinished.bind(this)}>
          {<Done />}
        </Button>}
      </div>)}

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={this.state.snackbarOpen}
        message={this.state.snackbarMessage}
        onClose={this.handleSnackbarClose}
        autoHideDuration={1500}
        transitionDuration={400}
      />
    </div >);
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);
