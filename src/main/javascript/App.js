import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import deepPurple from '@material-ui/core/colors/deepPurple';

import Board from './components/board/Board';
import BoardActiveList from './components/board/BoardActiveList';
import NewBoard from './components/board/NewBoard';
import Utils from './components/Utils';
import Timer from './components/Timer';
import BarSettings from './components/BarSettings';
import TeamMenu from './components/TeamMenu';

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
      snackbarMessage: "",
      snackbarOpen: false,
      selectedMember: null,
    };

    this.updateSelectedBoard = this.updateSelectedBoard.bind(this);
    this.updateSelectedTeam = this.updateSelectedTeam.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.updatePillars = this.updatePillars.bind(this);

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

  handleSnackbarClose() {
    this.setState({ snackbarOpen: false })
  }

  handleSnackbarOpen(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
    });
  }

  updatePillars() {
    Utils.get(this.state.board.pillarsLink, (body => {
      let pillars = body._embedded.pillars;
      this.setState({ pillars });
    }));
  }

  updateSelectedMember(member) {
    this.setState({ selectedMember: member });
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
          this.setState({
            board,
            page: "board",
            team: board.team,
          });
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
        Utils.fetchResource("teamMember/team/" + teamID, (body => {
          let members = body._embedded.members;
          console.log("#App# members after team selected:", members);
          this.setState({ members });
        }));
      }
    });
  }

  handleFloatingButtonClick() {
    const { page } = this.state;
    if (page === "") {
      this.setState({
        page: "newBoard",
      })
    }
  }

  render() {
    const { members, board, teams, boards, team, page, selectedMember } = this.state;
    const { classes } = this.props;
    console.log("page:", page);
    return (<div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <Typography variant="title" color="inherit" noWrap style={{ flexGrow: 1 }}>
            {board && board.name && board.name.toUpperCase()}
          </Typography>

          <div style={{ flexGrow: 1 }}>
            <Timer board={board} />
          </div>

          <BarSettings />
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
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === "board" && (
          <Board members={members} board={board} teams={teams} team={team}
            updateSelectedTeam={this.updateSelectedTeam}
            handleSnackbarOpen={this.handleSnackbarOpen}
          />
        )}
        {page === "newBoard" && (
          <NewBoard members={members} teams={teams} updatePage={this.updatePage}
            updateSelectedBoard={this.updateSelectedBoard}
          />
        )}
        {page === "activeBoards" && (
          <BoardActiveList boards={boards} updatePage={this.updatePage}
            updateSelectedBoard={this.updateSelectedBoard}
          />
        )}
      </main>

      {page === "" && <Button variant="fab" className={classes.fab}
        onClick={this.handleFloatingButtonClick.bind(this)}>
        {<Add />}
      </Button>}

      {page === "board" && <Button variant="fab" className={classes.fab}
        onClick={this.handleFloatingButtonClick.bind(this)}>
        {<Done />}
      </Button>}

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
