import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Divider } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { selectTeam } from '../actions/teamActions';
import { fetchTeamActiveBoards, selectBoard } from '../actions/boardActions';
import { showPage } from '../actions/localActions';
import { compose } from 'redux';

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
    if (teamID === null) {
      this.props.selectBoard(null);
      this.props.showPage("");
    } else {
      console.log("i am here in component");
      this.props.fetchTeamActiveBoards(teamID);
    }
    this.handleMenuClose();
  }

  handleTeamCreate() {
    this.props.showPage("teamCreate");
    this.handleMenuClose();
  }

  render() {
    const { team, teams } = this.props;
    const { anchorEl } = this.state;

    return (<div>
      <Button fullWidth variant="flat" style={{ color: "white" }}
        onClick={this.handleClick.bind(this)} >
        {team ? team.name : "TEAMS"}
      </Button>
      <Menu anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleMenuClose.bind(this)}>
        <MenuItem onClick={this.handleTeamSelect.bind(this, null)}>
          {'TEAMS'}
        </MenuItem>
        <Divider />
        {teams.map(t => (
          <MenuItem key={t.id} onClick={this.handleTeamSelect.bind(this, t.id)}>
            {t.name}
          </MenuItem>
        ))}
        <MenuItem onClick={this.handleTeamCreate.bind(this)}>
          <Add />
        </MenuItem>
      </Menu>
    </div>)
  }
}

const mapStateToProps = state => ({
  team: state.teams.team,
  teams: state.teams.teams,
});
const mapDispatchToProps = (dispatch) => {
  return {
    selectTeam: (id) => dispatch(selectTeam(id)),
    selectBoard: (id) => dispatch(selectBoard(id)),
    fetchTeamActiveBoards: (id) => dispatch(fetchTeamActiveBoards(id)),
    showPage: (page) => dispatch(showPage(page)),
  };
};

TeamMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(TeamMenu);
