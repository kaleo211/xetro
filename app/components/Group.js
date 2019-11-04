import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardTitle,
  Persona,
  PersonaPresence,
  PersonaSize,
  Stack,
  Text,
  Overlay,
  IconButton,
} from 'office-ui-fabric-react';

import { fetchGroupActiveBoard } from '../actions/boardActions';
import { finishItem, deleteItem } from '../actions/itemActions';

const classNames = mergeStyleSets({
  group: {
    marginTop: 8,
    marginRight: 8,
    width: 320,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: '0',
    bottom: '0',
    color: 'white',
    left: '0',
    position: 'absolute',
    right: '0',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  icon: {
    fontSize: 50,
    height: 50,
    width: 50,
  },
  actions: {
    marginTop: 16,
    marginLeft: 8,
  },
  members: {
    marginTop: 8,
    marginLeft: 8,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredActionID: '',
    };
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

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  onHoverAction(action) {
    this.setState({ hoveredActionID: action.id });
  }

  onLeaveHoveredAction() {
    this.setState({ hoveredActionID: '' });
  }

  onFinishAction(item) {
    this.props.finishItem(item);
  }

  async onRemoveAction(item) {
    await this.props.deleteItem(item);
  }

  render() {
    const { group, activeBoard } = this.props;
    const { hoveredActionID } = this.state;

    const facilitator = activeBoard && activeBoard.facilitator;
    const members = group.members.map(member => {
      return {
        ...member,
        imageInitials: member.initials,
        text: member.name,
        secondaryText: member.title,
        tertiaryText: 'In a meeting',
      };
    });
    const actions = group.actions.filter(action => action.stage !== 'done');
    const membersWithActions = members.filter(m => {
      return m.actions && m.actions.filter(a => !a.finished && a.groupID === group.id).length > 0;
    });

    const finishIcon = {
      iconName: 'CheckMark',
      style: {
        fontSize: 50,
        color: 'white',
      },
    };

    const removeIcon = {
      iconName: 'Delete',
      style: {
        fontSize: 50,
        color: 'white',
      },
    };

    return (
      <div>
        <div className={classNames.members}>
          {/* <Text variant="xxLarge" style={{ marginBottom: 8 }}>Members</Text> */}
          <Stack horizontal>
            {members.map(member => (
              <Stack.Item key={member.id}>
                <Persona
                    {...member}
                    size={PersonaSize.size40}
                    presence={PersonaPresence.offline}
                />
              </Stack.Item>
            ))}
          </Stack>
        </div>

        <div className={classNames.actions}>
          <Text variant="xxLarge">Actions</Text>
          <Stack horizontal wrap>
            {actions && actions.map(action => (
              <Stack.Item key={action.id} align="auto">
                <DocumentCard
                    className={classNames.group}
                    onMouseEnter={this.onHoverAction.bind(this, action)}
                    onMouseLeave={this.onLeaveHoveredAction.bind(this)}
                >
                  <DocumentCardDetails>
                    <DocumentCardTitle title={action.title} />
                    <DocumentCardActivity activity="Oct 13 2019" people={[action.owner]} />
                  </DocumentCardDetails>
                  {hoveredActionID === action.id &&
                    <Overlay>
                      <div className={classNames.overlay}>
                        <IconButton
                            className={classNames.icon}
                            iconProps={finishIcon}
                            onClick={this.onFinishAction.bind(this, action)}
                        />
                        <IconButton
                            className={classNames.icon}
                            iconProps={removeIcon}
                            onClick={this.onRemoveAction.bind(this, action)}
                        />
                      </div>
                    </Overlay>
                  }
                </DocumentCard>
              </Stack.Item>
            ))}
          </Stack>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  activeBoard: state.groups.activeBoard,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  fetchGroupActiveBoard: id => dispatch(fetchGroupActiveBoard(id)),
  finishItem: item => dispatch(finishItem(item)),
  deleteItem: item => dispatch(deleteItem(item)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Group);
