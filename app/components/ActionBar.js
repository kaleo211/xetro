import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IconButton } from 'office-ui-fabric-react';

import { setBoard, setBoards, archiveBoard, lockBoard, unlockBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import { openSnackBar, setPage } from '../actions/localActions';
import { finishItem } from '../actions/itemActions';

const classNames = mergeStyleSets({
  iconButton: {
    fontSize: 24,
    height: 24,
    width: 24,
    marginRight: 16,
  },
});

class ActionBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleVideoOpen(url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  handleLockBoard() {
    this.props.lockBoard(this.props.board.id);
    this.props.openSnackBar('Board is LOCKED.');
  }

  handleUnlockBoard() {
    this.props.unlockBoard(this.props.board.id);
    this.props.openSnackBar('Board is UNLOCKED.');
  }

  handleRefreshBoard() {
    this.props.setBoard(this.props.board.id);
  }

  handleViewHistory() {
    this.props.setBoards();
    this.props.setPage('boardList');
  }

  async handleArchiveBoard() {
    await this.props.archiveBoard(this.props.board.id);
    this.props.openSnackBar('Board is ARCHIVED.');
    await this.props.setGroup(this.props.group.id);
    this.props.setBoard(null);
  }

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  render() {
    const { board, page } = this.props;

    const videoIcon = {
      iconName: 'PresenceChickletVideo',
      style: {
        fontSize: 24,
        color: 'white',
      },
    };

    const saveIcon = {
      iconName: 'archive-svg',
      style: {
        fontSize: 24,
        color: 'white',
      },
    };
    const lockIcon = {
      iconName: 'Lock',
      style: {
        fontSize: 24,
        color: 'white',
      },
    };
    const unlockIcon = {
      iconName: 'Unlock',
      style: {
        fontSize: 24,
        color: 'white',
      },
    };

    return page === 'board' && board.stage !== 'archived' &&
      <div>
        {board.video &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={videoIcon}
          />
        }
        {board.stage === 'active' &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={saveIcon}
              onClick={this.handleArchiveBoard.bind(this)}
          />
        }
        {!board.locked &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={lockIcon}
              onClick={this.handleLockBoard.bind(this)}
          />
        }
        {board.locked &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={unlockIcon}
              onClick={this.handleUnlockBoard.bind(this)}
          />
        }
      </div>;
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  board: state.boards.board,
  page: state.local.page,
});

const mapDispatchToProps = (dispatch) => ({
  setBoard: id => dispatch(setBoard(id)),
  setBoards: () => dispatch(setBoards()),
  setGroup: id => dispatch(setGroup(id)),
  openSnackBar: message => dispatch(openSnackBar(message)),
  setPage: page => dispatch(setPage(page)),
  archiveBoard: id => dispatch(archiveBoard(id)),
  lockBoard: id => dispatch(lockBoard(id)),
  unlockBoard: id => dispatch(unlockBoard(id)),
  finishItem: item => dispatch(finishItem(item)),
});

ActionBar.propTypes = {
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ActionBar);
