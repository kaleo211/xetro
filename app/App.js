import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';

import Board from './components/Board';
import BoardList from './components/BoardList';
import Utils from './components/Utils';

import { searchGroups } from './actions/groupActions';
import {
  closeSnackBar,
  openDraw,
  closeDraw,
  setPage,
} from './actions/localActions';
import { fetchUsers, getMe } from './actions/userActions';
import Group from './components/Group';
import Home from './components/Home';
import Menu from './components/Menu';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: theme.spacing.unit * 1,
  },
  hide: {
    display: 'none',
  },
  grow: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 7 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 1,
  },
  arrow: {
    marginLeft: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
  },
  bar: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    String.prototype.capitalize = function () {
      if (this && this.length > 0) {
        return this.charAt(0).toUpperCase() + this.slice(1);
      }
      return '';
    };
  }

  async componentWillMount() {
    document.body.style.margin = 0;
    await this.handleMicrosoftLogin();
    this.props.fetchUsers();
    await this.props.searchGroups();
  }

  async handleMicrosoftLogin() {
    await this.props.getMe();
    if (this.props.me == null) {
      const uri = `${SSO_ADDRESS}/${SSO_TENANT_ID}/oauth2/authorize` +
                `?client_id=${SSO_CLIENT_ID}` +
                '&response_type=code' +
                `&redirect_uri=${SSO_REDIRECT_URL}` +
                '&response_mode=query';
      window.open(uri, 'microsoft', 'height=500,width=620');
    }

    while (this.props.me == null) {
      try {
        await this.props.getMe();
      } catch (err) {
        console.error('error login microsoft:', err);
      }
      await Utils.sleep(1000);
    }
  }

  render() {
    const { page, group, board, me, classes } = this.props;

    return (me &&
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed"><Menu /></AppBar>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {page === 'home' && <Home />}
          {page === 'group' && group && <Group />}
          {page === 'board' && board && <Board />}
          {page === 'boardList' && <BoardList />}
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  page: state.local.page,
  group: state.groups.group,
  me: state.users.me,
  board: state.boards.board,
  snackbarOpen: state.local.snackbarOpen,
  snackbarMessage: state.local.snackbarMessage,
  drawOpen: state.local.drawOpen,
});

export default connect(mapStateToProps, {
  searchGroups,
  closeSnackBar,
  fetchUsers,
  getMe,
  openDraw,
  closeDraw,
  setPage,
})(withStyles(styles, { withTheme: true })(App));
