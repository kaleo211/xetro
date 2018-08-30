import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Members from './Members';
import Pillars from './Pillars';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

import { LockOutlined, LockOpenOutlined } from '@material-ui/icons';

const drawerWidth = 75;

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
      selectedMember: null,
      snackbarMessage: "",
      snackbarOpen: false,
    };

    this.updatePillars = this.updatePillars.bind(this);
    this.updateSelectedMember = this.updateSelectedMember.bind(this);
    this.handleBoardLock = this.handleBoardLock.bind(this);
    this.handleBoardUnlock = this.handleBoardUnlock.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  updatePillars() {
    console.log("selected board:", this.state.board);
    fetch(this.state.board.pillarsLink)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          console.log("failed to fetch pillars");
        }
      })
      .then(data => {
        let pillars = data._embedded.pillars;
        this.setState({ pillars });
        console.log("updated pillars:", pillars);
      });
  }

  updateSelectedMember(member) {
    this.state.selectedMember = member;
  }

  updateBoard(board, link) {
    fetch(link, {
      method: 'PATCH',
      body: JSON.stringify(board),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        console.log("failed to lock board")
      }
    }).then(data => {
      let board = data;
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');

      this.setState({
        board: board,
      });
    })
  }

  handleBoardLock() {
    let board = {
      locked: true,
    };
    let boardLink = this.state.board._links.self.href;
    this.updateBoard(board, boardLink);

    this.handleSnackbarOpen("The board has been LOCKED.")
  }

  handleBoardUnlock() {
    let board = {
      locked: false,
    };
    let boardLink = this.state.board._links.self.href;
    this.updateBoard(board, boardLink);

    this.handleSnackbarOpen("The board has been UNLOCKED.")
  }

  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false,
    })
  }

  handleSnackbarOpen(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
    })
  }

  componentWillReceiveProps() {
    let board = this.props.board;
    if (board) {
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      fetch(board.pillarsLink)
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else {
            console.log("failed to fetch pillars")
          }
        }).then(data => {
          console.log("initialized pillars:", data);
          let pillars = data._embedded.pillars;
          this.setState({ board, pillars });
        });
    }
  }

  render() {
    const { classes, selectedMember, members, board } = this.props;
    const { pillars } = this.state;

    return (
      <div className={classes.root} >
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap style={{ flexGrow: 1 }}>
              Retro Board
            </Typography>
            <div>
              {board && !board.locked && (
                <IconButton onClick={this.handleBoardLock} color="inherit">
                  <LockOpenOutlined />
                </IconButton>
              )}
              {board && board.locked && (
                <IconButton onClick={this.handleBoardUnlock} color="inherit">
                  <LockOutlined />
                </IconButton>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" classes={{ paper: classes.drawerPaper, }}>
          <div className={classes.toolbar} />
          <Members members={members} selectedMember={selectedMember} updateSelectedMember={this.updateSelectedMember} />
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
