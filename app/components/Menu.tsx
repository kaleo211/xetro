import * as React from 'react';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { Text } from '@fluentui/react/lib/Text';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { Link, Icon } from '@fluentui/react';

import { setPage } from '../store/local/action';
import { joinOrCreateBoard } from '../store/board/action';
import ActionBar from './ActionBar';
import { BoardI, GroupI, UserI } from '../../types/models';
import { ApplicationState } from '../store/types';
import { keyable } from '../../utils/tool';

const classNames = mergeStyleSets({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: 32,
  },
  bread: {
    flexGrow: 4,
  },
  profile: {
    flexGrow: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 24,
    marginTop: 8,
  },
  text: {
    color: '#222222',
  },
  underline: {
    textDecoration: 'underline',
  },
  divider: {
    marginLeft: 12,
    marginRight: 12,
    color: '#222222',
  },
});


interface PropsI {
  group: GroupI;
  board: BoardI;
  page: string;
  me: UserI;

  setPage(page: string): void;
  joinOrCreateBoard(): Promise<void>;
}

interface StateI {}

class Menu extends React.Component<PropsI, StateI> {
  constructor(props:any) {
    super(props);
    this.state = {};
  }

  onJoinOrCreateBoard() {
    this.props.joinOrCreateBoard();
  }

  onRenderItem(item:keyable) {
    return item.key === 'action' ?
      <ActionBar /> :
      <Link onClick={item.onClick}>
        <Text
            // className={classNames(classNames.text, { [classNames.underline]: item.key == this.props.page })}
            variant="xLarge"
        >
          {item.text}
        </Text>
      </Link>;
  }

  render() {
    const { group, board, page, me } = this.props;

    const bread:IBreadcrumbItem[] = [{ text: 'Xetro', key: 'home', onClick: () => this.props.setPage('home') }];
    if (group) {
      bread.push({ text: group.name, key: 'group', onClick: () => this.props.setPage('group') });
      bread.push({ text: 'Board', key: 'board', onClick: this.onJoinOrCreateBoard.bind(this) });
    }
    if (board && page === 'board') {
      bread.push({ text: '', key: 'action' });
    }

    return (
      <div className={classNames.root}>
        <div className={classNames.bread}>
          <Breadcrumb
              items={bread}
              maxDisplayedItems={10}
              onRenderItem={this.onRenderItem.bind(this)}
              dividerAs={() => <Icon iconName="ChevronRightSmall" className={classNames.divider} />}
          />
        </div>
        <div className={classNames.profile}>
          <Text className={classNames.text} variant="xLarge">{me.firstName}</Text>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  group: state.group.group,
  board: state.board.board,
  page: state.local.page,
  me: state.user.me,
});
const mapDispatchToProps = (dispatch:Dispatch) => ({
  setPage: (page:string) => dispatch(setPage(page)),
  joinOrCreateBoard: () => dispatch(joinOrCreateBoard()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Menu);
