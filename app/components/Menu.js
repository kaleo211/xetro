import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { Text } from 'office-ui-fabric-react/lib/Text';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { Link, Icon } from 'office-ui-fabric-react';

import { setBoard, postBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import ActionBar from './ActionBar';

const classes = mergeStyleSets({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: 16,
  },
  bread: {
    flexGrow: 4,
  },
  profile: {
    flexGrow: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 12,
  },
  text: {
    color: 'white',
  },
  underline: {
    textDecoration: 'underline',
  },
  divider: {
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
  },
  icon: {
    fontSize: 24,
    height: 24,
    width: 24,
    paddingLeft: 8,
  },
});

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOpenHome() {
    this.props.setPage('home');
  }

  handleJoinOrCreateBoard() {
    const { activeBoard, group } = this.props;

    if (activeBoard) {
      this.props.setBoard(this.props.activeBoard.id);
      this.props.setPage('board');
      return;
    }

    const now = new Date();
    const boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
    const randomIndex = Math.floor(Math.random() * (group.members.length));

    const newBoard = {
      stage: 'active',
      groupID: group.id,
      name: boardName,
      facilitatorID: group.members[randomIndex].id,
    };

    this.props.postBoard(newBoard);
    this.props.setPage('board');
  }

  onRenderItem(item) {
    return item.key === 'action' ?
      <ActionBar /> :
      <Link onClick={item.onClick}>
        <Text
            className={classNames(classes.text, { [classes.underline]: item.key === this.props.page })}
            variant="xxLarge"
        >
          {item.text}
        </Text>
      </Link>;
  }

  render() {
    const { group, board, page } = this.props;

    const bread = [{ text: 'Xetro', key: 'home', onClick: () => this.props.setPage('home') }];
    if (group) {
      bread.push({ text: group.name, key: 'group', onClick: () => this.props.setPage('group') });
      bread.push({ text: 'Board', key: 'board', onClick: this.handleJoinOrCreateBoard.bind(this) });
    }
    if (board && page === 'board') {
      bread.push({ key: 'action' });
    }

    return (
      <div className={classes.root}>
        <div className={classes.bread}>
          <Breadcrumb
              items={bread}
              maxDisplayedItems={10}
              onRenderItem={this.onRenderItem.bind(this)}
              dividerAs={() => <Icon iconName="ChevronRightSmall" className={classes.divider} />}
          />
        </div>
        <div className={classes.profile}>
          <Text className={classes.text} variant="xxLarge">Xuebin</Text>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
  board: state.boards.board,
  page: state.local.page,
  activeBoard: state.boards.activeBoard,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  setBoard: (id) => dispatch(setBoard(id)),
  setPage: (page) => dispatch(setPage(page)),
  postBoard: (board) => dispatch(postBoard(board)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Menu);
