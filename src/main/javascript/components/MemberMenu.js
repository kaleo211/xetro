import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Add from '@material-ui/icons/Add';

import { addMemberToTeam } from '../actions/teamActions';

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

  handleMemberToAdd(memberID) {
    this.props.addMemberToTeam(this.props.team.id, memberID);
    this.handleMenuClose();
  }

  render() {
    const { team, users } = this.props;
    const { anchorEl } = this.state;

    return (users && team && <div>
      <IconButton onClick={this.handleClick.bind(this)}>
        <Add />
      </IconButton>
      <Menu
        id="MemberMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleMenuClose.bind(this)}
      >
        {users.map(user => (
          <MenuItem key={user.id} onClick={this.handleMemberToAdd.bind(this, user.id)}>
            {user.userID}
          </MenuItem>
        ))}
      </Menu>
    </div>)
  }
}

const mapStateToProps = state => ({
  team: state.teams.team,
  users: state.users.users,
});

MemberMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  addMemberToTeam,
})(withStyles(styles)(MemberMenu));
