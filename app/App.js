import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

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
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 1,
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

  async handleMicrosoftLogin() {
    if (this.props.me) {
      return;
    }
    var uri = `${SSO_ADDRESS}/${SSO_TENANT_ID}/oauth2/authorize
                  ?client_id=${SSO_CLIENT_ID}
                  &response_type=code
                  &redirect_uri=${SSO_REDIRECT_URL}
                  &response_mode=query`;
    window.open(uri, 'microsoft', 'height=500,width=620');

    while (this.props.me == null) {
      try {
        await this.props.getMe();
      } catch (err) {
        console.log('error login microsoft:', err);
      }
      await Utils.sleep(1000);
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
    const { page, group, classes } = this.props;
    const { open } = this.state;
    console.log('page in app', page);

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
            {group ? group.name : 'Xetro'}
          </Typography>

          <ActionBar />
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
        {open === true && < GroupList />}
        <Divider />
        <MemberList />
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === 'board' && <Board />}
        {page === 'createBoard' && <NewBoard />}
        {page === 'boardList' && <BoardList />}
        {page === 'createGroup' && <NewGroup />}
      </main>
    </div>);
  }
}

const mapStateToProps = state => ({
  page: state.local.page,
  group: state.groups.group,
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
