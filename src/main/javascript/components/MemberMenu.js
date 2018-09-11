import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Add from '@material-ui/icons/Add';

const styles = theme => ({
});

class MemberMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleClick(evt) {
    this.setState({ anchorEl: evt.currentTarget });
  }

  handleMenuClose() {
    this.setState({ anchorEl: null });
  }

  handleMemberSelect(memberID) {
    this.props.addMemberToTeam(memberID);
    this.handleMenuClose();
  }

  render() {
    const { team, members } = this.props;
    const { anchorEl } = this.state;

    return (members && team && <div>
      <IconButton onClick={this.handleClick.bind(this)}>
        <Add />
      </IconButton>
      <Menu
        id="MemberMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleMenuClose.bind(this)}
      >
        {members.map(member => (
          <MenuItem key={member.id} onClick={this.handleMemberSelect.bind(this, member.id)}>
            {member.userID}
          </MenuItem>
        ))}
      </Menu>
    </div>)
  }
}

MemberMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MemberMenu);
