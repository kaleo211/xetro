import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { FeedbackOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

import ActionBar from './components/ActionBar';
import Board from './components/Board';
import BoardList from './components/BoardList';
import MemberList from './components/MemberList';
import NewBoard from './components/NewBoard';
import NewGroup from './components/NewGroup';
import GroupMenu from './components/GroupMenu';
import { fetchGroups } from './actions/groupActions';
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
  feedback: {
    position: 'absolute',
    bottom: theme.spacing.unit * 1,
    left: theme.spacing.unit * 2,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      me: {},
    }

    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }

    this.handleMicrosoftLogin = this.handleMicrosoftLogin.bind(this);
  }

  componentWillMount() {
    document.body.style.margin = 0;
    // this.props.fetchGroups();
  }

  componentDidMount() {
    fetch('/me')
      .then(resp => {
        if (resp.status === 403) {
          this.handleMicrosoftLogin();
        } else {
          this.props.fetchUsers();
          this.setState({
            signedIn: true,
            me: resp.json(),
          })
        }
      })
      .then(me => {

      });
  }

  handleMicrosoftLogin() {
    var uri = `${SSO_ADDRESS}/${SSO_TENANT_ID}/oauth2/authorize
                  ?client_id=${SSO_CLIENT_ID}
                  &response_type=code
                  &redirect_uri=${SSO_REDIRECT_URL}
                  &response_mode=query`;
    var microsoft = window.open(uri, 'microsoft', 'height=500,width=620');

    var loginChecker = setInterval(() => {
      if (microsoft.closed) {
        fetch('/me')
          .then(resp => {
            if (resp.ok) {
              this.setState({
                me: resp.json(),
                signedIn: true,
              });
              clearInterval(loginChecker)
            }
          })
      }
    }, 200);
  }

  handleFeedbackClick() {
    let win = window.open("https://github.com/kaleo211/xetro-board/issues", '_blank');
    win.focus();
  }

  render() {
    const { page, board, classes } = this.props;
    return (<div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <div style={{ marginLeft: -20 }}>
            <GroupMenu />
          </div>
          <div style={{ flexGrow: 2 }} />

          <Typography variant="title" color="inherit" noWrap style={{ flexGrow: 1 }}>
            {board && board.name && board.name.toUpperCase()}
          </Typography>

          <div style={{ flexGrow: 1 }}>
          </div>
          {/* <ActionBar /> */}
        </Toolbar>
      </AppBar>

      {this.state.signedIn &&
        <div>
          <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
            <div className={classes.toolbar} />
            <MemberList />
            {/* <IconButton className={classes.feedback} onClick={this.handleFeedbackClick.bind(this)} >
              <FeedbackOutlined />
            </IconButton> */}
          </Drawer>

          <main className={classes.content}>
            <div className={classes.toolbar} />
            {page === "board" && <Board />}
            {page === "boardCreate" && <NewBoard />}
            {page === "boardList" && <BoardList />}
            {page === "groupCreate" && <NewGroup />}
          </main>
        </div>
      }

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={this.props.snackbarOpen}
        message={this.props.snackbarMessage}
        onClose={this.props.closeSnackBar}
        autoHideDuration={1500}
        transitionDuration={400} />
    </div >);
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  page: state.local.page,
  snackbarOpen: state.local.snackbarOpen,
  snackbarMessage: state.local.snackbarMessage,
});

App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  fetchGroups,
  closeSnackBar,
  fetchUsers,
})(withStyles(styles)(App));
