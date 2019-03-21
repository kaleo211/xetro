import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Done, Close } from '@material-ui/icons';

import { fetchGroups, postGroup } from '../actions/groupActions';
import { setPage } from '../actions/localActions';
import { compose } from 'redux';

const styles = theme => ({
});

class NewGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFieldChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    })
  }

  handleClose() {
    this.props.setPage('');
  }

  handleGroupAdd() {
    let group = {
      name: this.state.name,
    }
    this.props.postGroup(group);
    this.props.fetchGroups();

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
          <IconButton onClick={this.handleGroupAdd.bind(this)}>
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
    fetchGroups: () => dispatch(fetchGroups()),
    postGroup: (group) => dispatch(postGroup(group)),
    setPage: (page) => dispatch(setPage(page)),
  };
};

NewGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(NewGroup);
