import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { FeedbackOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import { ChevronLeft, Inbox } from '@material-ui/icons';

import ActionBar from './components/ActionBar';
import Board from './components/Board';
import BoardList from './components/BoardList';
import MemberList from './components/MemberList';
import NewBoard from './components/NewBoard';
import NewGroup from './components/NewGroup';
import GroupList from './components/GroupList';
import { fetchGroups } from './actions/groupActions';
import { closeSnackBar } from './actions/localActions';
import { fetchUsers, getMe } from './actions/userActions';
import Utils from './components/Utils';

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
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
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
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
  }

  async componentWillMount() {
    document.body.style.margin = 0;
    await this.handleMicrosoftLogin();
    this.props.fetchUsers();
    this.props.fetchGroups();
  }

  componentDidUpdate() {
  }

  async handleMicrosoftLogin() {
    if (this.props.me.id) {
      return;
    }

    var uri = `${SSO_ADDRESS}/${SSO_TENANT_ID}/oauth2/authorize
                  ?client_id=${SSO_CLIENT_ID}
                  &response_type=code
                  &redirect_uri=${SSO_REDIRECT_URL}
                  &response_mode=query`;
    var microsoft = window.open(uri, 'microsoft', 'height=500,width=620');

    while (true) {
      if (microsoft.closed) {
        this.props.getMe();
        break;
      }
      await Utils.sleep(1);
    }
  }

  handleFeedbackClick() {
    let win = window.open("https://github.com/kaleo211/xetro-board/issues", '_blank');
    win.focus();
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { page, board, classes } = this.props;
    const { open } = this.state;

    return (<div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, { [classes.appBarShift]: open })}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen}
            className={classNames(classes.menuButton, { [classes.hide]: open })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: classNames({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <GroupList />
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === "board" && <Board />}
        {page === 'createBoard' && <NewBoard />}
        {page === 'boardList' && <BoardList />}
        {page === 'createGroup' && <NewGroup />}
      </main>
    </div>);
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  page: state.local.page,
  me: state.users.me,
  snackbarOpen: state.local.snackbarOpen,
  snackbarMessage: state.local.snackbarMessage,
});

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  fetchGroups,
  closeSnackBar,
  fetchUsers,
  getMe,
})(withStyles(styles, { withTheme: true })(App));
