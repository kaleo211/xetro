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

import Board from './components/board/Board';
import BoardActiveList from './components/board/BoardActiveList';
import NewBoard from './components/board/NewBoard';
import Utils from './components/Utils';
import Timer from './components/Timer';
import BarSettings from './components/BarSettings';
import TeamMenu from './components/TeamMenu';
import MemberMenu from './components/MemberMenu';

import { fetchActiveBoards, updateSelectedMember, patchBoard } from './actions/boardActions';
import { fetchTeams } from './actions/teamActions';

import { connect } from 'react-redux';

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
      allMembers: [],
      snackbarMessage: "",
      snackbarOpen: false,
    };

    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleBoardUnlock = this.handleBoardUnlock.bind(this);
    this.handleBoardLock = this.handleBoardLock.bind(this);

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }

  componentWillMount() {
    document.body.style.margin = 0;

    this.props.fetchTeams();
    this.updateAllMembers();
  }

  updateAllMembers() {
    Utils.fetchResource("members", (body => {
      let allMembers = body._embedded.members;
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

  handleMemberSelect(memberID) {
    this.props.updateSelectedMember(memberID);
  }

  handleBoardLock() {
    let updatedBoard = { locked: true };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.handleSnackbarOpen("Board is LOCKED.")
  }

  handleBoardUnlock() {
    let updatedBoard = { locked: false };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.handleSnackbarOpen("Board is UNLOCKED.");
  }

  handleBoardFinish() {
    let updatedBoard = { finished: true };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.props.showPage("boardCreate");
    this.handleSnackbarOpen("Board is ARCHIVED.");
  }

  render() {
    const { page, board, classes, teams, members, team, selectedMember } = this.props;
    console.log("page:", page, "teams", teams, "members", members, "team", team);

    return (teams && members && <div className={classes.root}>
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
          <TeamMenu />
        </div>
        <List component="nav" style={{ marginLeft: -6 }}>
          {members.map(member => (
            <ListItem key={"side" + member.userID} button
              onClick={this.handleMemberSelect.bind(this, member.id)}
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
          <MemberMenu />
        </div>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === "board" && (<Board />)}
        {page === "boardCreate" && (<NewBoard />)}
        {page === "activeBoards" && (<BoardActiveList />)}
      </main>

      {team && (<div>
        {page === "board" && <Button variant="fab" className={classes.fab}
          onClick={this.handleBoardFinish.bind(this)}>
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

const mapStateToProps = state => ({
  teams: state.teams.teams,
  team: state.teams.team,
  members: state.teams.members,
  board: state.boards.board,
  page: state.local.page,
  selectedMember: state.boards.selectedMember
});

App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  fetchTeams,
  patchBoard,
  fetchActiveBoards,
  updateSelectedMember
})(withStyles(styles)(App));
