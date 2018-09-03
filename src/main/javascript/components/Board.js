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

import {
  LockOutlined,
  LockOpenOutlined,
  KeyboardRounded,
  VoiceChat,
} from '@material-ui/icons';

import Utils from './Utils';
import Pillars from './Pillars';
import Timer from './Timer';

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
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boards: null,
      board: null,
      pillars: [],
      members: [],
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

  validateBoard(board) {
    if (board._embedded) {
      board.facilitator = board._embedded.facilitator;
    }
    return board;
  }

  updateSelected(member) {
    console.log("updated member in board:", member._links.self.href);
    let updatedBoard = {
      selected: member._links.self.href,
    }
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      console.log("returned board:", this.validateBoard(body))
      this.setState({ board: this.validateBoard(body) });
    }));
  }

  handleBoardLock() {
    let updatedBoard = { locked: true };
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      let board = body;
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      this.setState({ board: this.validateBoard(board) });
    }));
    this.handleSnackbarOpen("Board is LOCKED.")
  }

  handleBoardUnlock() {
    let updatedBoard = { locked: false };
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      let board = body;
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      this.setState({ board: this.validateBoard(board) });
    }));
    this.handleSnackbarOpen("Board is UNLOCKED.")
  }

  handleSnackbarClose() {
    this.setState({ snackbarOpen: false })
  }

  handleSnackbarOpen(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
    })
  }

  handleVideoOpen(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  componentWillReceiveProps() {
    this.setState({
      members: this.props.members,
    });

    let board = this.props.board;
    if (board) {
      console.log("board in receive:", board);
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      Utils.get(board.pillarsLink, (body => {
        console.log("updating pillars with board:", board);
        let pillars = body._embedded.pillars;
        this.setState({ board: this.validateBoard(board), pillars });
      }));
    }
  }

  render() {
    const { classes } = this.props;
    const { pillars, board, members } = this.state;
    console.log("board in board:", board);

    return (
      <div className={classes.root} >
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap style={{ flexGrow: 1 }}>
              Retro Board
            </Typography>

            <div style={{ flexGrow: 1 }}>
              <Timer board={board} />
            </div>

            <div>
              {board && board.facilitator && board.facilitator.video && (
                <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
                  <VoiceChat />
                </IconButton>
              )}
              {board && !board.locked && (
                <IconButton onClick={this.handleBoardLock.bind(this)} color="inherit">
                  <LockOpenOutlined />
                </IconButton>
              )}
              {board && board.locked && (
                <IconButton onClick={this.handleBoardUnlock.bind(this)} color="inherit">
                  <LockOutlined />
                </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" classes={{ paper: classes.drawerPaper, }}>
          <div className={classes.toolbar} />
          <List component="nav" style={{ marginRight: -20 }}>
            {members.map(member => (
              <ListItem key={"side" + member.userID} button
                onClick={this.updateSelected.bind(this, member)}
                style={{ paddingTop: 16, paddingBottom: 16 }}
              >
                <ListItemAvatar>
                  {board && (board._embedded && board._embedded.selected && board._embedded.selected.userID === member.userID
                    || board.selected && board.selected.userID === member.userID) ? (
                      <Badge badgeContent={(<KeyboardRounded />)}>
                        <Avatar>{member.userID}</Avatar>
                      </Badge>
                    ) : (<Avatar>{member.userID}</Avatar>)}
                </ListItemAvatar>
              </ListItem>
            ))}
          </List >
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
      </div >
    );
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Board);
