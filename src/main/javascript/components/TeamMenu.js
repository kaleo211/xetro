import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { selectTeam } from '../actions/teamActions';
import { connect } from 'react-redux';

const styles = theme => ({
});

class TeamMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleClick(evt) {
    this.setState({ anchorEl: evt.currentTarget });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
  };

  handleTeamSelect(teamID) {
    this.props.selectTeam(teamID);
    this.handleMenuClose();
  }

  render() {
    const { team, teams } = this.props;
    const { anchorEl } = this.state;

    return (<div>
      <Button fullWidth variant="contained" component="span"
        onClick={this.handleClick.bind(this)}
      >
        {team ? team.name : "TEAMS"}
      </Button>
      <Menu
        id="teamMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleMenuClose.bind(this)}
      >
        {teams.map(t => (
          <MenuItem key={t.id} onClick={this.handleTeamSelect.bind(this, t.id)}>
            {t.name}
          </MenuItem>
        ))}
      </Menu>
    </div>)
  }
}

const mapStateToProps = state => ({
  team: state.teams.team,
  teams: state.teams.teams,
});

TeamMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, { selectTeam })(withStyles(styles)(TeamMenu));
