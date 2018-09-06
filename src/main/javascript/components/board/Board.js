import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import deepPurple from '@material-ui/core/colors/deepPurple';
import Tooltip from '@material-ui/core/Tooltip';

import {
  LockOutlined,
  LockOpenOutlined,
  KeyboardRounded,
  VoiceChat,
  RefreshRounded,
} from '@material-ui/icons';

import Utils from '../Utils';
import Pillars from '../Pillars';
import Timer from '../Timer';
import TeamMenu from '../TeamMenu';

const drawerWidth = 82;

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
  pillar: {
    height: '100%',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
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
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pillars: [],
      snackbarMessage: "",
      snackbarOpen: false,
    };

    this.updatePillars = this.updatePillars.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  updatePillars() {
    Utils.get(this.state.board.pillarsLink, (body => {
      let pillars = body._embedded.pillars;
      this.setState({ pillars });
    }));
  }

  updateSelected(member) {
    let updatedBoard = {
      selected: member._links.self.href,
    }
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      this.setState({ board: Utils.reformBoard(body) });
    }));
  }

  handleBoardLock() {
    let updatedBoard = { locked: true };
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      let board = body;
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      this.setState({ board: Utils.reformBoard(board) });
    }));
    this.handleSnackbarOpen("Board is LOCKED.")
  }

  handleBoardUnlock() {
    let updatedBoard = { locked: false };
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      let board = body;
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      this.setState({ board: Utils.reformBoard(board) });
    }));
    this.handleSnackbarOpen("Board is UNLOCKED.");
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

  handleVideoOpen(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  componentWillReceiveProps() {
    let board = this.props.board;
    if (board) {
      console.log("board in receive:", board);
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      Utils.get(board.pillarsLink, (body => {
        console.log("updating pillars with board:", board);
        let pillars = body._embedded.pillars;
        this.setState({ board: Utils.reformBoard(board), pillars });
      }));
    }
  }

  render() {
    const { classes, board, teams, team, members } = this.props;
    const { pillars } = this.state;

    return (<div>{board && (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap style={{ flexGrow: 1 }}>
              {board.team && board.team.name && (
                board.team.name.toUpperCase()
              )}
            </Typography>

            <div style={{ flexGrow: 1 }}>
              <Timer board={board} />
            </div>

            <div>
              <Tooltip title="Refresh board" placement="bottom">
                <IconButton onClick={this.updatePillars} color="inherit">
                  <RefreshRounded />
                </IconButton>
              </Tooltip>
              {board.facilitator && board.facilitator.video && (
                <Tooltip title="Open video chat" placement="bottom">
                  <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
                    <VoiceChat />
                  </IconButton>
                </Tooltip>
              )}
              {!board.locked && (
                <Tooltip title="Lock board" placement="bottom">
                  <IconButton onClick={this.handleBoardLock.bind(this)} color="inherit">
                    <LockOpenOutlined />
                  </IconButton>
                </Tooltip>
              )}
              {board.locked && (
                <Tooltip title="Unlock board" placement="bottom">
                  <IconButton onClick={this.handleBoardUnlock.bind(this)} color="inherit">
                    <LockOutlined />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
          <div className={classes.toolbar} />
          <div style={{ marginTop: 8 }}>
            <TeamMenu team={team} teams={teams} updateSelectedTeam={this.props.updateSelectedTeam} />
          </div>
          <List component="nav" style={{ marginLeft: -6 }}>
            {members.map(member => (
              <ListItem key={"side" + member.userID} button
                onClick={this.updateSelected.bind(this, member)}
                style={{ paddingTop: 16, paddingBottom: 16 }}
              >
                <ListItemAvatar>
                  {board.selected && board.selected.userID === member.userID ? (
                    <Badge badgeContent={(<KeyboardRounded />)}>
                      <Avatar className={board.facilitator && board.facilitator.userID === member.userID ? classes.purpleAvatar : null}>{member.userID}</Avatar>
                    </Badge>
                  ) : (<Avatar className={board.facilitator && board.facilitator.userID === member.userID ? classes.purpleAvatar : null}>{member.userID}</Avatar>)}
                </ListItemAvatar>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Pillars pillars={pillars} updatePillars={this.updatePillars} members={members} board={board} />
        </main>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          onClose={this.handleSnackbarClose}
          autoHideDuration={1500}
          transitionDuration={400}
        />
      </div>
    )}</div >
    );
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Board);
