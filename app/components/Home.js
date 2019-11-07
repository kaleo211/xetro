import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import { Stack, DocumentCard, DocumentCardTitle, DocumentCardActivity } from 'office-ui-fabric-react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';

import { setGroup, searchGroups, addUserToGroup } from '../actions/groupActions';
import { setPage } from '../actions/localActions';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
  },
  divider: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
  },
  iconButton: {
    padding: 0,
  },
  group: {
    marginTop: 8,
    marginRight: 8,
    width: 320,
    height: 198,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onSetGroup(group) {
    const isMember = group.members.filter(member => member.id === this.props.me.id).length !== 0;
    if (!isMember) {
      this.props.addUserToGroup(this.props.me.id, group.id);
    }
    this.props.setGroup(group.id);
  }

  async onSearchGroup(evt) {
    await this.props.searchGroups({ name: evt.target.value });
  }

  handleCreateGroup() {
    this.props.setPage('createGroup');
  }

  render() {
    const { me, groups, classes } = this.props;

    return (me &&
      <div>
        <SearchBox
            placeholder="Search Group"
            onChange={this.onSearchGroup.bind(this)}
        />

        <Stack horizontal wrap>
          {groups && groups.map(g => (
            <Stack.Item key={g.id} align="auto">
              <TooltipHost content="Click to Join Group">
                <DocumentCard
                    className={classes.group}
                    onClick={this.onSetGroup.bind(this, g)}
                >
                  <DocumentCardTitle title={g.name} />
                  <DocumentCardActivity people={g.members} />
                  <DocumentCardTitle title="No ongoing meeting" showAsSecondaryTitle />
                  {/* <DocumentCardStatus status="3 Actions" /> */}
                </DocumentCard>
              </TooltipHost>
            </Stack.Item>
          ))}
        </Stack>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
  board: state.boards.board,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  setGroup: (id) => dispatch(setGroup(id)),
  setPage: (page) => dispatch(setPage(page)),
  searchGroups: (query) => dispatch(searchGroups(query)),
  addUserToGroup: (userID, groupID) => dispatch(addUserToGroup(userID, groupID)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Group);
