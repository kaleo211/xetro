import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Done, Close } from '@material-ui/icons';

import { fetchUsers, postUser } from '../actions/userActions';
import { showPage } from '../actions/localActions';
import { compose } from 'redux';

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

  handleClose() {
    this.props.showPage("");
  }

  handleUserAdd() {
    let user = {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userID: this.state.userID,
    }
    this.props.postUser(user).then(() => {
      this.props.fetchUsers();
    });

    this.handleClose();
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
        <div style={{ marginLeft: 'auto' }}>
          <IconButton onClick={this.handleClose.bind(this)}>
            <Close />
          </IconButton>
          <IconButton onClick={this.handleUserAdd.bind(this)}>
            <Done />
          </IconButton>
        </div>
      </CardActions>
    </Card>);
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = (dispatch) => {
  return {
    postUser: (user) => postUser(user).then(r => dispatch(r)),
    fetchUsers: () => fetchUsers().then(r => dispatch(r)),
    showPage: (page) => dispatch(showPage(page)),
  };
};

NewUser.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(NewUser);
