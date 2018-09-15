import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';

import BarSettings from './components/BarSettings';
import Board from './components/board/Board';
import BoardActiveList from './components/board/BoardActiveList';
import MemberMenu from './components/MemberMenu';
import NewBoard from './components/board/NewBoard';
import NewUser from './components/NewUser';
import TeamMenu from './components/TeamMenu';

import { fetchTeams } from './actions/teamActions';
import { closeSnackBar } from './actions/localActions';
import { fetchUsers } from './actions/userActions';

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
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }

  componentWillMount() {
    document.body.style.margin = 0;

    this.props.fetchTeams();
    this.props.fetchUsers();
  }

  render() {
    const { page, board, classes, teams, team } = this.props;
    return (teams && <div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <div style={{ marginLeft: -20 }}>
            <TeamMenu />
          </div>
          <div style={{ flexGrow: 2 }} />

          <Typography variant="title" color="inherit" noWrap style={{ flexGrow: 1 }}>
            {board && board.name && board.name.toUpperCase()}
          </Typography>

          <div style={{ flexGrow: 1 }}>
            {/* {board && board.started && !board.finished && <Timer board={board} />} */}
          </div>
          <BarSettings />
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
        <div className={classes.toolbar} />
        <MemberMenu />
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === "board" && <Board />}
        {page === "boardCreate" && <NewBoard />}
        {page === "activeBoards" && <BoardActiveList />}
        {page === "userCreate" && <NewUser />}
      </main>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={this.props.snackbarOpen}
        message={this.props.snackbarMessage}
        onClose={this.props.closeSnackBar}
        autoHideDuration={1500}
        transitionDuration={400}
      />
    </div >);
  }
}

const mapStateToProps = state => ({
  teams: state.teams.teams,
  team: state.teams.team,
  board: state.boards.board,
  page: state.local.page,
  snackbarOpen: state.local.snackbarOpen,
  snackbarMessage: state.local.snackbarMessage,
});

App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  fetchTeams,
  closeSnackBar,
  fetchUsers,
})(withStyles(styles)(App));
