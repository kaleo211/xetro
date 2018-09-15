import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Done } from '@material-ui/icons';

import { fetchUsers, postUser } from '../actions/userActions';
import { showPage } from '../actions/localActions';

const styles = theme => ({
});

class NewUser extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFieldChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  handleUserAdd() {
    let user = {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userID: this.state.userID,
    }
    this.props.postUser(user);
    this.props.showPage("");
    this.props.fetchUsers();
  }

  render() {
    return (<Card style={{ margin: 16 }}>
      <CardContent>
        <Grid container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={16}
          style={{ padding: 16 }} >
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              label="User ID"
              name="userID"
              onChange={this.handleFieldChange.bind(this)} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} >
            <TextField
              fullWidth
              label="First name"
              name="firstName"
              onChange={this.handleFieldChange.bind(this)} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              label="Last name"
              name="lastName"
              onChange={this.handleFieldChange.bind(this)} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              onChange={this.handleFieldChange.bind(this)} />
          </Grid>
        </Grid >
      </CardContent>
      <CardActions>
        <IconButton style={{ marginLeft: 'auto' }} onClick={this.handleUserAdd.bind(this)}>
          <Done />
        </IconButton>
      </CardActions>
    </Card>);
  }
}

const mapStateToProps = state => ({
});

NewUser.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  postUser,
  showPage,
  fetchUsers,
})(withStyles(styles)(NewUser));