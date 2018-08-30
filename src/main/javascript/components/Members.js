import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { ListItemText } from '@material-ui/core';

const styles = theme => ({
});

class Members extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { members, selectedMember } = this.props;
    return (
      <List component="nav">
        {members.map(member => (
          <ListItem key={member.userID} button
            selected={true}
            onClick={this.props.updateSelectedMember(member)}
          >
            <ListItemText primary="haha" />
            {/* <ListItemAvatar style={{ marginLeft: -8 }}>
              <Avatar>{member.userID}</Avatar>
            </ListItemAvatar> */}
          </ListItem>
        ))}
      </List>
    )
  }
}

Members.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Members);
