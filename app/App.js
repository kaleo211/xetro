import React from 'react';
import { connect } from 'react-redux';

import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import Board from './components/Board';
import Utils from './components/Utils';

import { searchGroups } from './actions/groupActions';
import { setPage } from './actions/localActions';
import { fetchUsers, getMe } from './actions/userActions';
import Group from './components/Group';
import Home from './components/Home';
import Menu from './components/Menu';
import { MICROSOFT_URI } from './constants';

initializeIcons();

const classNames = mergeStyleSets({
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    height: 48,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 4,
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: '#FAF9F8',
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
    const { page, group, board, me } = this.props;

    return (me &&
      <div className={classNames.app}>
        <div className={classNames.nav}>
          <Menu />
        </div>
        <main className={classNames.content}>
          {page === 'home' && <Home />}
          {page === 'group' && group && <Group />}
          {page === 'board' && board && <Board />}
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  me: state.users.me,
  page: state.local.page,
});

export default connect(mapStateToProps, {
  fetchUsers,
  getMe,
  searchGroups,
  setPage,
})(App);
