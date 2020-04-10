import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardTitle,
  FontIcon,
  IconButton,
  Overlay,
  Stack,
  Separator,
  Dropdown,
  Label,
} from 'office-ui-fabric-react';
import { mergeStyleSets, createTheme } from 'office-ui-fabric-react/lib/Styling';

import { fetchGroupActiveBoard, joinOrCreateBoard } from '../actions/boardActions';
import { finishAction, deleteAction } from '../actions/itemActions';
import { setFacilitator } from '../actions/groupActions';
import { date } from '../../utils/tool';

const theme = createTheme({
  fonts: {
    medium: {
      fontFamily: 'Monaco, Menlo, Consolas',
      fontSize: '30px'
    }
  }
});

const classNames = mergeStyleSets({
  group: {
    marginRight: 4,
    width: 320,
    height: 112,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    top: 0,
    bottom: 0,
    color: 'white',
    left: 0,
    position: 'absolute',
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  icon: {
    fontSize: 40,
    height: 40,
    width: 40,
    marginRight: 16,
  },
  cancel: {
    fontSize: 16,
    height: 16,
    width: 16,
    marginRight: 4,
    marginTop: -8,
  },
  actions: {
    marginTop: 4,
    marginLeft: 4,
  },
  noActionsIcon: {
    fontSize: 40,
    height: 40,
    width: 40,
    color: 'green',
  },
  actionCard: {
    marginRight: 4,
    width: 240,
    height: 72,
    padding: 8,
    paddingLeft: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 24,
  },
  facilitatorCard: {
    fontSize: 24,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredActionID: '',
      isFacilitatorHovered: false,
    };

    this.onSetFacilitator = this.onSetFacilitator.bind(this);
  }

  async componentDidMount() {
    await this.props.fetchGroupActiveBoard(this.props.group.id);
  }

  getDate() {
    const now = new Date();
    const numbers = this.state.endTime.split(':');
    now.setHours(numbers[0], numbers[1], 0);
    return now;
  }

  onHoverAction(action) {
    this.setState({ hoveredActionID: action.id });
  }

  onLeaveHoveredAction() {
    this.setState({ hoveredActionID: '' });
  }

  onHoverFacilitator() {
    this.setState({ isFacilitatorHovered: true });
  }

  onLeaveHoveredFacilitator() {
    this.setState({ isFacilitatorHovered: false });
  }

  async onFinishAction(item) {
    await this.props.finishAction(item);
  }

  async onRemoveAction(item) {
    await this.props.deleteAction(item);
  }

  async onSetFacilitator(evt, facilitator) {
    await this.props.setFacilitator(facilitator.key);
    this.setState({ isFacilitatorHovered: false });
  }

  onJoinOrCreateGroup() {
    this.props.joinOrCreateBoard();
  }

  render() {
    const { group } = this.props;
    const { hoveredActionID, isFacilitatorHovered } = this.state;

    const actions = group.actions;
    const finishIcon = {
      iconName: 'BoxCheckmarkSolid',
      style: {
        fontSize: 40,
        color: '#498205',
      },
    };
    const removeIcon = {
      iconName: 'BoxMultiplySolid',
      style: {
        fontSize: 16,
        color: '#d13438',
      },
    };
    console.log('group', group);

    const members = group.members.map(member => ({key: member.id, text: member.name}));

    return (
      <div className={classNames.actions}>
        <div style={{display:'flex'}}>
          <DocumentCard className={classNames.actionCard}
              onMouseOver={this.onHoverFacilitator.bind(this)}
              onFocus={() => {}}
              onMouseLeave={this.onLeaveHoveredFacilitator.bind(this)}
          >
            <div className={classNames.facilitatorCard}>
              <Dropdown
                  label="Facilitator of the Week"
                  options={members}
                  selectedKey={group.facilitator.id}
                  onChange={(evt, facilitator) => this.onSetFacilitator(evt, facilitator)}
              />
            </div>
          </DocumentCard>
          <DocumentCard className={classNames.actionCard} onClick={this.onJoinOrCreateGroup.bind(this)}>
            <div className={classNames.actionTitle}>
              Open Board
            </div>
          </DocumentCard>
        </div>
        <Separator theme={theme} styles={{content: {backgroundColor: 'rgba(0,0,0,0)'}}}>Action Items</Separator>
        <Stack horizontal wrap>
          {actions && actions.map(action => (
            <Stack.Item key={action.id} align="auto">
              <DocumentCard
                  className={classNames.group}
                  onMouseOver={this.onHoverAction.bind(this, action)}
                  onFocus={() => {}}
                  onMouseLeave={this.onLeaveHoveredAction.bind(this)}
              >
                <DocumentCardDetails>
                  <DocumentCardTitle title={action.title} />
                  <DocumentCardActivity activity={date(action.createdAt)} people={[action.owner]} />
                </DocumentCardDetails>
                {hoveredActionID === action.id &&
                  <Overlay>
                    <div className={classNames.overlay}>
                      <div>
                        <IconButton
                            className={classNames.cancel}
                            iconProps={removeIcon}
                            onClick={this.onRemoveAction.bind(this, action)}
                        />
                      </div>
                      <div>
                        <IconButton
                            className={classNames.icon}
                            iconProps={finishIcon}
                            onClick={this.onFinishAction.bind(this, action)}
                        />
                      </div>
                    </div>
                  </Overlay>
                }
              </DocumentCard>
            </Stack.Item>
          ))}
          {actions && actions.length === 0 &&
            <Stack.Item>
              <DocumentCard className={classNames.group}>
                <DocumentCardTitle title="No Actions" />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FontIcon iconName="SkypeCircleCheck" className={classNames.noActionsIcon} />
                </div>
              </DocumentCard>
            </Stack.Item>
          }
        </Stack>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  deleteAction: action => dispatch(deleteAction(action)),
  fetchGroupActiveBoard: id => dispatch(fetchGroupActiveBoard(id)),
  finishAction: action => dispatch(finishAction(action)),
  joinOrCreateBoard: () => dispatch(joinOrCreateBoard()),
  setFacilitator: (id) => dispatch(setFacilitator(id)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Group);
