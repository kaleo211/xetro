import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Done, Close } from '@material-ui/icons';

import { fetchTeams, postTeam } from '../actions/teamActions';
import { showPage } from '../actions/localActions';

const styles = theme => ({
});

class NewTeam extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFieldChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  handleClose() {
    this.props.showPage("");
  }

  handleTeamAdd() {
    let team = {
      name: this.state.name,
    }
    this.props.postTeam(team);
    this.props.fetchTeams();

    this.handleClose();
  }

  render() {
    return (<Card style={{ margin: 16 }}>
      <CardContent>
        <Grid container
          direction="row"
          justify="flex-start" z
          alignItems="flex-start"
          spacing={16}
          style={{ padding: 16 }} >
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              label="name"
              name="name"
              onChange={this.handleFieldChange.bind(this)} />
          </Grid>
        </Grid >
      </CardContent>
      <CardActions>
        <div style={{ marginLeft: 'auto' }}>
          <IconButton onClick={this.handleClose.bind(this)}>
            <Close />
          </IconButton>
          <IconButton onClick={this.handleTeamAdd.bind(this)}>
            <Done />
          </IconButton>
        </div>

      </CardActions>
    </Card>);
  }
}

const mapStateToProps = state => ({
});

NewTeam.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  showPage,
  fetchTeams,
  postTeam,
})(withStyles(styles)(NewTeam));
