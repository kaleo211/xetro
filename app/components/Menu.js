import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import { Grid, Toolbar, IconButton } from '@material-ui/core';
import { AccountBox, ViewWeekRounded } from '@material-ui/icons';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';


import { setBoard, postBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import ActionBar from './ActionBar';
import { Link, Icon } from 'office-ui-fabric-react';

const classNames = mergeStyleSets({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  bread: {
    flexGrow: 8,
  },
  action: {
    display: 'flex',
    flexGrow: 4,
    justifyContent: 'flex-end',
  },
  text: {
    color: 'white',
  },
  divider: {
    marginLeft: 12,
    marginRight: 12,
    color: 'white',
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

  handleJoinBoard() {
    this.props.setBoard(this.props.activeBoard.id);
    this.props.setPage('board');
  }

  handleCreateBoard() {
    const { activeBoard, group } = this.props;

    const now = new Date();
    const boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;

    const newBoard = {
      stage: 'active',
      groupID: group.id,
      name: boardName,
    };

    if (activeBoard && activeBoard.facilitator) {
      newBoard.facilitatorID = activeBoard.facilitator.id;
    } else {
      const randomIndex = Math.floor(Math.random() * (group.members.length));
      newBoard.facilitatorID = group.members[randomIndex].id;
    }

    this.props.postBoard(newBoard);
    this.props.setPage('board');
  }

  onRenderItem(item) {
    return (
      <Link onClick={item.onClick}>
        <Text className={classNames.text} variant="xxLarge">{item.text}</Text>
      </Link>
    );
  }

  render() {
    const { me, group, board, page, activeBoard } = this.props;

    const enterBoard = () => {
      if (activeBoard) {
        return (
          <IconButton color="inherit" onClick={this.handleJoinBoard.bind(this)}>
            <ViewWeekRounded fontSize="large" />
          </IconButton>
        );
      }
      return (
        <IconButton color="inherit" onClick={this.handleCreateBoard.bind(this)}>
          <ViewWeekRounded fontSize="large" />
        </IconButton>
      );
    };

    const bread = [{ text: 'Xetro', key: 'xetro', onClick: '' }];
    group && bread.push({ text: group.name, key: 'group', onClick: '' });
    board && bread.push({ text: board.name, key: 'board', onClick: '' });

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
        <div className={classNames.action}>
          {board && <ActionBar />}
          {page === 'group' && enterBoard()}
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
