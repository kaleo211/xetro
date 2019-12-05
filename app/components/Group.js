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
} from 'office-ui-fabric-react';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { fetchGroupActiveBoard } from '../actions/boardActions';
import { finishAction, deleteAction } from '../actions/itemActions';

const classNames = mergeStyleSets({
  group: {
    marginRight: 4,
    width: 320,
    height: 112,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    top: '0',
    bottom: '0',
    color: 'white',
    left: '0',
    position: 'absolute',
    right: '0',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 48,
    paddingRight: 8,
  },
  icon: {
    fontSize: 40,
    height: 40,
    width: 40,
    marginRight: 16,
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

  onHoverAction(action) {
    this.setState({ hoveredActionID: action.id });
  }

  onLeaveHoveredAction() {
    this.setState({ hoveredActionID: '' });
  }

  async onFinishAction(item) {
    await this.props.finishAction(item);
  }

  async onRemoveAction(item) {
    await this.props.deleteAction(item);
  }

  render() {
    const { group } = this.props;
    const { hoveredActionID } = this.state;

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
        fontSize: 40,
        color: '#d13438',
      },
    };

    return (
      <div className={classNames.actions}>
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
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Group);
