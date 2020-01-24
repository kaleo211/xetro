import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import {
  DocumentCard, DocumentCardTitle, IconButton, ProgressIndicator, Persona, PersonaSize, Text, Overlay
} from 'office-ui-fabric-react';

import {
  setActiveItem, showActions, hideActions, showAddingAction
} from '../actions/localActions';
import {
  deleteItem, likeItem, finishItem, startItem
} from '../actions/itemActions';
import Action from './Action';

import { isBlank } from '../../utils/tool';

const iconStyle = {
  fontSize: 18,
  color: '#222222',
};

const classes = mergeStyleSets({
  card: {
    maxWidth: '33vw',
    minWidth: 320,
    marginTop: 4,
  },
  actionCard: {
    maxWidth: '33vw',
    marginTop: 2,
    minHeight: 40,
    minWidth: 290,
    display: 'flex',
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 4,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'space-between',
    backgroundColor: '#fdfcfb',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  titleTextDone:{
    textDecorationLine: 'line-through',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 4,
  },
  iconButton: {
    marginTop: 12,
  },
  progress: {
    marginTop: 36,
  },
});

class Pillar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDeleteItem(item) {
    this.props.deleteItem({ ...item, boardID: this.props.board.id });
  }

  async onStartItem(item, evt) {
    evt.stopPropagation();
    const { activeItem } = this.props;
    if (!isBlank(activeItem)) {
      await this.props.finishItem(activeItem)
    }
    this.props.startItem({ ...item, boardID: this.props.board.id });
  }

  onLikeItem(item, evt) {
    evt.stopPropagation();
    this.props.likeItem({ ...item, boardID: this.props.board.id });
  }

  async onFinishItem(item) {
    await this.props.finishItem({ ...item, boardID: this.props.board.id });
  }

  async onClickAddActionButton(item) {
    this.props.showAddingAction();
  }

  onHideActions(item) {
    this.props.hideActions(item.id);
  }

  onShowActions(item) {
    this.props.showActions(item.id);
  }

  render() {
    const { activeItem, itemProgress, pillar, board, showActionMap, addingAction } = this.props;
    const items = pillar.items;

    const showTimer = (item) => {
      return board.locked && board.stage === 'created' && item.stage === 'created';
    };
    const showFinishButton = (item) => {
      return board.locked && board.stage === 'created' && item.stage === 'active';
    };
    const showActionButton = (item) => {
      return board.locked && board.stage === 'created' && item.stage !== 'created';
    };
    const showAddAction = (item) => {
      return board.locked && board.stage === 'created' && item.id === activeItem.id && addingAction;
    };
    const showFoldButton = (item) => {
      return item.actions.length > 0;
    };

    return items.map(item => (
      <div key={item.id}>
        <DocumentCard key={item.id} className={classes.card}>
          <div className={classes.title}>
            <DocumentCardTitle
                title={item.title}
                className={item.stage !== 'done' ? classes.titleText : classes.titleTextDone}
            />
            <div className={classes.actions}>
              {showFoldButton(item) && (
                typeof showActionMap[item.id] === 'undefined' || !showActionMap[item.id] ?
                  <IconButton
                      primary
                      className={classes.iconButton}
                      iconProps={{ iconName: 'ChevronUp', style: iconStyle }}
                      onClick={this.onShowActions.bind(this, item)}
                  /> :
                  <IconButton
                      primary
                      className={classes.iconButton}
                      iconProps={{ iconName: 'ChevronDown', style: iconStyle }}
                      onClick={this.onHideActions.bind(this, item)}
                  />
              )}
              {!board.locked &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'Delete', style: iconStyle }}
                    onClick={this.onDeleteItem.bind(this, item)}
                />
              }
              {!board.locked &&
                <div>
                  <IconButton
                      primary
                      className={classes.iconButton}
                      iconProps={{ iconName: 'Like', style: iconStyle }}
                      onClick={this.onLikeItem.bind(this, item)}
                  />
                </div>
              }
              {showTimer(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'Stopwatch', style: iconStyle }}
                    onClick={this.onStartItem.bind(this, item)}
                />
              }
              {showFinishButton(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'CheckMark', style: iconStyle }}
                    onClick={this.onFinishItem.bind(this, item)}
                />
              }
              {showActionButton(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'MyMoviesTV', style: iconStyle }}
                    onClick={this.onClickAddActionButton.bind(this, item)}
                />
              }
            </div>
          </div>
          {showAddAction(item) && <Action />}
          {board.locked && item.id === activeItem.id && item.stage === 'active' &&
            <Overlay className={classes.progress}>
              <ProgressIndicator percentComplete={1 - itemProgress} barHeight={10} />
            </Overlay>
          }
        </DocumentCard>
        {showActionMap[item.id] && item.actions.map(action => (
          <DocumentCard key={action.id} className={classes.actionCard}>
            <Text variant="medium">{action.title}</Text>
            <Persona text={action.owner.initials} hidePersonaDetails size={PersonaSize.size24} />
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
  addingAction: state.local.addingAction,
});

const mapDispatchToProps = (dispatch) => ({
  deleteItem: (item) => dispatch(deleteItem(item)),
  setActiveItem: (item) => dispatch(setActiveItem(item)),
  likeItem: (id) => dispatch(likeItem(id)),
  finishItem: (item) => dispatch(finishItem(item)),
  startItem: (item) => dispatch(startItem(item)),
  showActions: (item) => dispatch(showActions(item)),
  hideActions: (item) => dispatch(hideActions(item)),
  showAddingAction: () => dispatch(showAddingAction()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Pillar);
