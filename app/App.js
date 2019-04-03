import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { ArrowForwardIosOutlined } from '@material-ui/icons';

import ActionBar from './components/ActionBar';
import Board from './components/Board';
import BoardList from './components/BoardList';
import NewBoard from './components/NewBoard';
import NewGroup from './components/NewGroup';
import Utils from './components/Utils';

import { fetchGroups } from './actions/groupActions';
import { closeSnackBar, openDraw, closeDraw } from './actions/localActions';
import { fetchUsers, getMe } from './actions/userActions';
import Sidebar from './components/Sidebar';

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
    margin: theme.spacing.unit,
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
    await this.props.getMe();
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
      console.log("i am here", this.props.me);
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
    this.props.openDraw();
  };

  handleDrawerClose = () => {
    this.props.closeDraw();
  };

  render() {
    const { page, group, board, drawOpen, classes } = this.props;
    console.log('page in app', page, board, group);

    return (<div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, { [classes.appBarShift]: drawOpen })}
      >
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen}
            className={classNames(classes.menuButton, { [classes.hide]: drawOpen })}
          >
            <MenuIcon />
          </IconButton>
          <Grid container
            alignItems="center"
            justify="space-between"
            direction="row"
            className={classes.bar}
          >
            <Grid container alignItems="center" item md={6}>
              <Grid item>
                <Typography variant="h6" color="inherit" noWrap>
                  {group ? group.name : 'Xetro'}
                </Typography>
              </Grid>
              {board &&
                <Grid item xs={1}>
                  <ArrowForwardIosOutlined className={classes.arrow} />
                </Grid>
              }
              {board &&
                <Grid item md={3}>
                  <BoardList />
                </Grid>
              }
            </Grid>
            <Grid container item justify="flex-end" md={6}>
              {page === 'board' && board && board.stage !== 'archived' && <ActionBar />}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={drawOpen}
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: drawOpen,
          [classes.drawerClose]: !drawOpen,
        })}
        classes={{
          paper: classNames({
            [classes.drawerOpen]: drawOpen,
            [classes.drawerClose]: !drawOpen,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        {drawOpen && <Sidebar />}
      </Drawer>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === 'board' && board && <Board />}
        {page === 'createBoard' && group && <NewBoard />}
        {page === 'boardList' && <BoardList />}
        {page === 'createGroup' && <NewGroup />}
      </main>
    </div >);
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

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  fetchGroups,
  closeSnackBar,
  fetchUsers,
  getMe,
  openDraw,
  closeDraw,
})(withStyles(styles, { withTheme: true })(App));
