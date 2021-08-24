import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { DocumentCard, DocumentCardActivity, DocumentCardDetails, DocumentCardTitle, FontIcon, IconButton, Overlay, Stack, Separator, Dropdown } from '@fluentui/react';
import { mergeStyleSets, createTheme } from '@fluentui/react/lib/Styling';

import { fetchGroupActiveBoard, joinOrCreateBoard } from '../store/board/action';
import { finishTaskThunk, deleteTask } from '../store/item/action';
import { setFacilitator } from '../store/group/action';
import { date } from '../../utils/tool';
import { Keyable } from '../../types/common';
import { ApplicationState } from '../store/types';
import { TaskI, GroupI } from '../../types/models';
import { Link } from 'react-router-dom';

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
  tasks: {
    marginTop: 4,
    marginLeft: 4,
  },
  noTasksIcon: {
    fontSize: 40,
    height: 40,
    width: 40,
    color: 'green',
  },
  taskCard: {
    marginRight: 4,
    width: 240,
    height: 72,
    padding: 8,
    paddingLeft: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 24,
  },
  facilitatorCard: {
    fontSize: 24,
  },
});


interface PropsI {
  group: GroupI;

  deleteTask(task: TaskI): Promise<void>;
  fetchGroupActiveBoard(id: string): Promise<void>;
  finishTaskThunk(task: TaskI): Promise<void>;
  joinOrCreateBoard(): void;
  setFacilitator(id: string): Promise<void>;
}

interface StateI {
  hoveredTaskID: string,
  isFacilitatorHovered: boolean,
}

class Group extends React.Component<PropsI, StateI> {
  constructor(props: any) {
    super(props);

    this.state = {
      hoveredTaskID: '',
      isFacilitatorHovered: false,
    };

    this.onSetFacilitator = this.onSetFacilitator.bind(this);
  }

  async componentDidMount() {
    await this.props.fetchGroupActiveBoard(this.props.group.id);
  }

  onHoverTask(task:TaskI) {
    this.setState({ hoveredTaskID: task.id });
  }

  onLeaveHoveredTask() {
    this.setState({ hoveredTaskID: '' });
  }

  onHoverFacilitator() {
    this.setState({ isFacilitatorHovered: true });
  }

  onLeaveHoveredFacilitator() {
    this.setState({ isFacilitatorHovered: false });
  }

  async onfinishTaskThunk(task:TaskI) {
    await this.props.finishTaskThunk(task);
  }

  async onRemoveTask(task:TaskI) {
    await this.props.deleteTask(task);
  }

  async onSetFacilitator(evt:any, facilitator: Keyable) {
    await this.props.setFacilitator(facilitator.key);
    this.setState({ isFacilitatorHovered: false });
  }

  onJoinOrCreateBoard() {
    this.props.joinOrCreateBoard();
  }

  render() {
    const { group } = this.props;
    const { hoveredTaskID } = this.state;

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

    const formattedMembers = (group: GroupI) => {
      return group.members.map(member => ({ key: member.id, text: member.name }));
    }

    return (group &&
      <div className={classNames.tasks}>
        <div style={{display:'flex'}}>
          <DocumentCard className={classNames.taskCard}
              onMouseOver={this.onHoverFacilitator.bind(this)}
              onMouseLeave={this.onLeaveHoveredFacilitator.bind(this)}
          >
            <div className={classNames.facilitatorCard}>
              <Dropdown
                  label="Facilitator of the Week"
                  options={formattedMembers(group)}
                  selectedKey={group.facilitatorID}
                  onChange={(evt, facilitator) => this.onSetFacilitator(evt, facilitator)}
              />
            </div>
          </DocumentCard>
          <Link to='/board'>
            <DocumentCard className={classNames.taskCard} onClick={this.onJoinOrCreateBoard.bind(this)}>
              <div className={classNames.taskTitle}>
                Open Board
              </div>
            </DocumentCard>
          </Link>
        </div>
        <Separator theme={theme} styles={{content: {backgroundColor: 'rgba(0,0,0,0)'}}}>Task Items</Separator>
        <Stack horizontal wrap>
          {group.tasks && group.tasks.map(task => (
            <Stack.Item key={task.id} align="auto">
              <DocumentCard
                  className={classNames.group}
                  onMouseOver={this.onHoverTask.bind(this, task)}
                  onMouseLeave={this.onLeaveHoveredTask.bind(this)}
              >
                <DocumentCardDetails>
                  <DocumentCardTitle title={task.title} />
                  <DocumentCardActivity activity={date(task.createdAt)} people={[{ ...task.owner, profileImageSrc: '', name: task.owner.name }]} />
                </DocumentCardDetails>
                {hoveredTaskID === task.id &&
                  <Overlay>
                    <div className={classNames.overlay}>
                      <div>
                        <IconButton
                            className={classNames.cancel}
                            iconProps={removeIcon}
                            onClick={this.onRemoveTask.bind(this, task)}
                        />
                      </div>
                      <div>
                        <IconButton
                            className={classNames.icon}
                            iconProps={finishIcon}
                            onClick={this.onfinishTaskThunk.bind(this, task)}
                        />
                      </div>
                    </div>
                  </Overlay>
                }
              </DocumentCard>
            </Stack.Item>
          ))}
          {group.tasks && group.tasks.length === 0 &&
            <Stack.Item>
              <DocumentCard className={classNames.group}>
                <DocumentCardTitle title="No Tasks" />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <FontIcon iconName="SkypeCircleCheck" className={classNames.noTasksIcon} />
                </div>
              </DocumentCard>
            </Stack.Item>
          }
        </Stack>
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  group: state.group.group,
  me: state.user.me,
});
const mapDispatchToProps = { deleteTask, fetchGroupActiveBoard, finishTaskThunk, joinOrCreateBoard, setFacilitator };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Group);
