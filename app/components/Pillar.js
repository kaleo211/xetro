import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import {
  DocumentCard,
  DocumentCardTitle,
  IconButton,
  ProgressIndicator,
} from 'office-ui-fabric-react';

import {
  setActiveItem,
  showActions,
  hideActions,
} from '../actions/localActions';
import {
  deleteItem,
  likeItem,
  finishItem,
  startItem,
} from '../actions/itemActions';
import Action from './Action';

const classNames = mergeStyleSets({
  card: {
    maxWidth: '33vw',
    minWidth: 320,
    marginTop: 4,
  },
  actionCard: {
    maxWidth: '33vw',
    minWidth: 320,
    maxHeight: 36,
    marginTop: 2,
    marginLeft: 16,
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 4,
  },
  iconButton: {
    marginTop: 12,
  },
});

class Pillar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingAction: false,
      activeItemDOM: null,
    };
  }

  handleActivateItem(item) {
    this.props.setActiveItem(item);
    if (this.props.activeItem.id === item.id && this.state.switcher) {
      this.setState({ switcher: false });
    } else {
      this.setState({ switcher: true });
    }
  }

  handleDeleteItem(item) {
    this.props.deleteItem({ ...item, boardID: this.props.board.id });
  }

  handleStartItem(item, evt) {
    evt.stopPropagation();
    this.props.startItem({ ...item, boardID: this.props.board.id });
    this.setState({ switcher: true });
  }

  handleLikeItem(item, evt) {
    evt.stopPropagation();
    this.props.likeItem({ ...item, boardID: this.props.board.id });
  }

  async handleFinishItem(item) {
    await this.props.finishItem({ ...item, boardID: this.props.board.id });
  }

  async onClickAddActionButton(item, evt) {
    this.setState({
      isAddingAction: true,
      activeItemDOM: evt.target,
    });
    this.props.setActiveItem(item);
    await this.handleFinishItem(item);
  }

  onHideActions(item) {
    this.props.hideActions(item.id);
  }

  onShowActions(item) {
    this.props.showActions(item.id);
  }

  render() {
    const { activeItem, itemProgress, pillar, board, showActionMap } = this.props;
    const { activeItemDOM, isAddingAction } = this.state;

    const items = pillar.items;

    const showTimer = (item) => {
      return board.locked && board.stage === 'active' && item.stage === 'created';
    };
    const showFinishButton = (item) => {
      return board.locked && board.stage === 'active' && item.stage === 'active';
    };
    const showActionButton = (item) => {
      return board.locked && board.stage === 'active' && item.stage !== 'created';
    };
    const showAddAction = (item) => {
      return board.locked && board.stage === 'active' && item.id === activeItem.id && isAddingAction;
    };
    const showFoldButton = (item) => {
      return item.actions.length > 0;
    };

    return items.map(item => (
      <div>
        <DocumentCard
            key={item.id}
            className={classNames.card}
        >
          <div className={classNames.title}>
            <DocumentCardTitle
                title={item.title}
                className={item.stage !== 'done' ? classNames.titleText : null}
            />
            <div className={classNames.actions}>
              {!board.locked &&
                <IconButton
                    primary
                    className={classNames.iconButton}
                    iconProps={{ iconName: 'delete-svg' }}
                    onClick={this.handleDeleteItem.bind(this, item)}
                />
              }
              {!board.locked &&
                <IconButton
                    primary
                    className={classNames.iconButton}
                    iconProps={{ iconName: 'thumbsup-svg' }}
                    onClick={this.handleLikeItem.bind(this, item)}
                />
              }
              {showTimer(item) &&
                <IconButton
                    primary
                    className={classNames.iconButton}
                    iconProps={{ iconName: 'timer-svg' }}
                    onClick={this.handleStartItem.bind(this, item)}
                />
              }
              {showFinishButton(item) &&
                <IconButton
                    primary
                    className={classNames.iconButton}
                    iconProps={{ iconName: 'done-svg' }}
                    onClick={this.handleFinishItem.bind(this, item)}
                />
              }
              {showFoldButton(item) && (
                typeof showActionMap[item.id] === 'undefined' || !showActionMap[item.id] ?
                  <IconButton
                      primary
                      className={classNames.iconButton}
                      iconProps={{ iconName: 'arrow-up-svg' }}
                      onClick={this.onShowActions.bind(this, item)}
                  /> :
                  <IconButton
                      primary
                      className={classNames.iconButton}
                      iconProps={{ iconName: 'arrow-down-svg' }}
                      onClick={this.onHideActions.bind(this, item)}
                  />
              )}
              {showActionButton(item) &&
                <IconButton
                    primary
                    className={classNames.iconButton}
                    iconProps={{ iconName: 'action-svg' }}
                    onClick={this.onClickAddActionButton.bind(this, item)}
                />
              }
            </div>
          </div>
          {showAddAction(item) &&
            <Action target={activeItemDOM} />
          }
          {board.locked && item.id === activeItem.id && item.stage === 'active' &&
            <ProgressIndicator percentComplete={1 - itemProgress} />
          }
        </DocumentCard>
        {showActionMap[item.id] && item.actions.map(action => (
          <DocumentCard
              className={classNames.actionCard}
          >
            <DocumentCardTitle
                title={action.title}
            />
          </DocumentCard>
        ))}
      </div>
    ));
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  activeItem: state.local.activeItem,
  showActionMap: state.local.showActionMap,
});

const mapDispatchToProps = (dispatch) => ({
  deleteItem: (item) => dispatch(deleteItem(item)),
  setActiveItem: (item) => dispatch(setActiveItem(item)),
  likeItem: (id) => dispatch(likeItem(id)),
  finishItem: (id) => dispatch(finishItem(id)),
  startItem: (item) => dispatch(startItem(item)),
  showActions: (item) => dispatch(showActions(item)),
  hideActions: (item) => dispatch(hideActions(item)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Pillar);
