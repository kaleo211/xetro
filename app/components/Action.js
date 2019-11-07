import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  IconButton,
  TextField,
  FocusTrapCallout,
  FocusZone,
  Button,
} from 'office-ui-fabric-react';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { setActiveItem } from '../actions/localActions';
import {
  postItem,
  deleteItem,
  likeItem,
  finishItem,
  startItem,
  patchItem,
  postAction,
} from '../actions/itemActions';
import { setBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';

const classNames = mergeStyleSets({
  addButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
});

class Action extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newActionTitle: '',
      newActionOwner: null,
      activeItemDOM: null,
    };
  }

  onChangeNewActionTitle(evt) {
    this.setState({
      newActionTitle: evt.target.value,
    });
  }

  async onClickAddActionButton(item, evt) {
    this.setState({
      activeItemDOM: evt.target,
    });
    this.props.setActiveItem(item);
    await this.handleFinishItem(item);
  }

  async onSaveAction(item) {
    const { newActionTitle, newActionOwner } = this.state;
    const newAction = {
      title: newActionTitle.capitalize(),
      itemID: item.id,
      ownerID: newActionOwner.id,
      groupID: this.props.group.id,
      boardID: this.props.board.id,
    };
    await this.props.postAction(newAction);

    this.setState({
      newActionTitle: '',
      newActionOwner: null,
    });
  }

  onSetActionOwner(member) {
    this.setState({ newActionOwner: member });
  }

  render() {
    const { activeItem, group } = this.props;
    const { newActionOwner, activeItemDOM } = this.state;

    const members = group.members.map(member => {
      return {
        ...member,
        text: member.name,
        onClick: this.onSetActionOwner.bind(this, member),
      };
    });

    return (
      <FocusTrapCallout
          role="alertdialog"
          gapSpace={0}
          setInitialFocus
          target={activeItemDOM}
          style={{ padding: 8, width: 320 }}
      >
        <FocusZone>
          <div>
            <div style={{ display: 'flex', verticalAlign: 'middle' }}>
              <div style={{ width: '100%' }}>
                <TextField
                    underlined
                    style={{ width: '100%' }}
                    onChange={this.onChangeNewActionTitle.bind(this)}
                />
              </div>
              {newActionOwner ?
                <Button
                    text={newActionOwner.initials}
                    menuProps={{
                      shouldFocusOnMount: true,
                      items: members,
                    }}
                /> :
                <IconButton
                    primary
                    iconProps={{ iconName: 'assign-svg' }}
                    menuProps={{
                      shouldFocusOnMount: true,
                      items: members,
                    }}
                />
              }
            </div>
            <div className={classNames.addButton}>
              <IconButton
                  iconProps={{ iconName: 'delete-svg' }}
                  onClick={this.onSaveAction.bind(this, activeItem)}
              />
              <IconButton
                  iconProps={{ iconName: 'done-svg' }}
                  onClick={this.onSaveAction.bind(this, activeItem)}
              />
            </div>
          </div>
        </FocusZone>
      </FocusTrapCallout>
    );
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  activeItem: state.local.activeItem,
});

const mapDispatchToProps = (dispatch) => ({
  postItem: (i, item, boardID) => dispatch(postItem(i, item, boardID)),
  deleteItem: (item) => dispatch(deleteItem(item)),
  setBoard: (id) => dispatch(setBoard(id)),
  setActiveItem: (item) => dispatch(setActiveItem(item)),
  setGroup: (id) => dispatch(setGroup(id)),
  likeItem: (id) => dispatch(likeItem(id)),
  finishItem: (id) => dispatch(finishItem(id)),
  startItem: (item) => dispatch(startItem(item)),
  patchItem: (item) => dispatch(patchItem(item)),
  postAction: (action) => dispatch(postAction(action)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Action);
