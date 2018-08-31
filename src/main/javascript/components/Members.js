import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Badge } from '@material-ui/core';
import { KeyboardRounded } from '@material-ui/icons';

const styles = theme => ({
});

class Members extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      selectedMember: null,
    }
  }

  componentWillReceiveProps() {
    // console.log("members in members:", this.props.selectedMember);
    this.setState({
      members: this.props.members,
      selectedMember: this.props.selectedMember,
    })
  }

  updateSelected(member) {
    this.setState(
      { selectedMember: member },
      this.props.updateSelectedMember(member) // wait for state to be updated
    );
  }

  render() {
    const { members, selectedMember } = this.state;
    // console.log("update member:", selectedMember, members);
    return (
      <List component="nav" style={{ marginRight: -20 }}>
        {members.map(member => (
          <ListItem key={"side" + member.userID} button
            selected={true}
            onClick={this.updateSelected.bind(this, member)}
            style={{ paddingTop: 16, paddingBottom: 16 }}
          >
            <ListItemAvatar>
              {selectedMember && selectedMember.userID === member.userID ? (
                <Badge badgeContent={(<KeyboardRounded />)}>
                  <Avatar>{member.userID}</Avatar>
                </Badge>
              ) : (<Avatar>{member.userID}</Avatar>)}
            </ListItemAvatar>
          </ListItem>
        ))}
      </List >
    )
  }
}

Members.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Members);
