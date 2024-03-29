import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { initializeIcons } from '@fluentui/react/lib/Icons';
import { mergeStyleSets, loadTheme } from '@fluentui/react/lib/Styling';
import Confetti from 'react-dom-confetti';
import { Image } from '@fluentui/react';
import { io, Socket } from 'socket.io-client';

import Board from './components/Board';
import Group from './components/Group';
import Home from './components/Home';
import Menu from './components/Menu';
import { searchGroups } from './store/group/action';
import { setSocketIOClient } from './store/local/action';
import { fetchUsers, getMe } from './store/user/action';
import { sleep } from '../utils/tool';
import yay from './public/yay.png';
import { BoardI, GroupI, UserI } from '../types/models';
import { ApplicationState } from './store/types';
import { Keyable } from '../types/common';

initializeIcons();

loadTheme({
  palette: {
    themePrimary: '#0078d4',
    black: '#1d1d1d',
    white: '#fafafa',
  },
});

const classNames = mergeStyleSets({
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    height: 48,
    display: 'flex',
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
  float: {
    position: 'fixed',
    bottom: 16,
    right: 16,
  },
});


interface PropsI {
  me: UserI;
  group: GroupI;
  board: BoardI;

  getMe(): Promise<void>;
  fetchUsers(): Promise<void>;
  searchGroups(query: Keyable): Promise<void>;
  setSocketIOClient(client: Socket): void;
}

interface StateI {
  confetti: boolean;
}

class App extends React.Component<PropsI, StateI> {
  constructor(props: any) {
    super(props);
    document.body.style.margin = '0';

    this.state = {
      confetti: false,
    };
  }

  async componentDidMount() {
    await this.props.getMe();
    if (this.props.me == null) {
      window.open('/dell', '_self');
    }

    while (this.props.me == null) {
      try {
        await this.props.getMe();
      } catch (err) {
        console.error('error login Dell:', err);
      }
      await sleep(1000);
    }
    await this.props.fetchUsers();
    await this.props.searchGroups({});

    // this.props.setSocketIOClient(io());
  }

  async onConfetti() {
    this.setState({ confetti: true });
    await sleep(1000);
    this.setState({ confetti: false });
  }

  render() {
    const { me } = this.props;
    const { confetti } = this.state;

    return (me &&
      <div className={classNames.app}>
        <div className={classNames.nav}>
          <Menu />
        </div>
        <main className={classNames.content}>
          <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/group' component={Group} />
            <Route path='/board' component={Board} />
          </Switch>
          <div className={classNames.float}>
            <Image height={48} width={48} src={yay} onClick={this.onConfetti.bind(this)} />
            <Confetti active={confetti} config={{ angle: 120, dragFriction: 0.12, startVelocity: 120, elementCount: 200 }} />
          </div>
      </main>
      </div>
    );
  }
}

const mapStateToProps = (state:ApplicationState) => ({
  board: state.board.board,
  group: state.group.group,
  me: state.user.me,
});
const mapDispatchToProps = { fetchUsers, getMe, searchGroups, setSocketIOClient };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(App);
