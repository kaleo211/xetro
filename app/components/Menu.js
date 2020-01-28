import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { Text } from 'office-ui-fabric-react/lib/Text';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Breadcrumb } from 'office-ui-fabric-react/lib/Breadcrumb';
import { Link, Icon } from 'office-ui-fabric-react';

import { setPage } from '../actions/localActions';
import { joinOrCreateBoard } from '../actions/boardActions';
import ActionBar from './ActionBar';

const classes = mergeStyleSets({
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

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onJoinOrCreateBoard() {
    this.props.joinOrCreateBoard();
  }

  onRenderItem(item) {
    return item.key === 'action' ?
      <ActionBar /> :
      <Link onClick={item.onClick}>
        <Text
            className={classNames(classes.text, { [classes.underline]: item.key === this.props.page })}
            variant="xLarge"
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
      bread.push({ text: 'Board', key: 'board', onClick: this.onJoinOrCreateBoard.bind(this) });
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
          <Text className={classes.text} variant="xLarge">Xuebin</Text>
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
  setPage: (page) => dispatch(setPage(page)),
  joinOrCreateBoard: () => dispatch(joinOrCreateBoard()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Menu);
