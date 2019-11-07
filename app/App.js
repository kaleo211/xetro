import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { mergeStyleSets, registerIcons } from 'office-ui-fabric-react/lib/Styling';

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
import { MICROSOFT_URI } from './constants';

initializeIcons();
registerIcons({
  icons: {
    'thumbsup-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 -2 24 24">
        <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
        <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
      </svg>
    ),
    'delete-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z" />
      </svg>
    ),
    'timer-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M14 1h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1zm-2 13c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1zm7.03-6.61l.75-.75c.38-.38.39-1.01 0-1.4l-.01-.01c-.39-.39-1.01-.38-1.4 0l-.75.75C16.07 4.74 14.12 4 12 4c-4.8 0-8.88 3.96-9 8.76C2.87 17.84 6.94 22 12 22c4.98 0 9-4.03 9-9 0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    ),
    'done-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z" />
      </svg>
    ),
    'assign-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.22 0 .41.1.55.25.12.13.2.31.2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.19.08-.37.2-.5.14-.15.33-.25.55-.25zM19 19H5V5h14v14zM12 6c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-6 6.47V18h12v-1.53c0-2.5-3.97-3.58-6-3.58s-6 1.07-6 3.58zM8.31 16c.69-.56 2.38-1.12 3.69-1.12s3.01.56 3.69 1.12H8.31z" />
      </svg>
    ),
    'add-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z" />
      </svg>
    ),
    'action-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z" />
      </svg>
    ),
    'arrow-down-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
      </svg>
    ),
    'arrow-up-svg': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
      </svg>
    ),
  },
});

const classNames = mergeStyleSets({
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    height: 56,
    alignItems: 'center',
    color: 'white',
    backgroundColor: '#355895',
    paddingBottom: 4,
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
  },
});

const styles = theme => ({
  root: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  grow: {
    flexGrow: 1,
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
      window.open(MICROSOFT_URI, 'microsoft', 'height=500,width=620');
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
      <div className={classNames.app}>
        <div className={classNames.nav}>
          <Menu />
        </div>

        <main className={classes.content}>
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
