import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Done, Close } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

import { getMe } from '../actions/userActions';
import { fetchGroups, postGroup } from '../actions/groupActions';
import { setPage } from '../actions/localActions';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import NoSsr from '@material-ui/core/NoSsr';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Utils from './Utils';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class NewGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  async handleCreateGroup(search) {
    let group = {
      name: search.value,
      members: [this.props.me.id],
    }
    await this.props.postGroup(group);
    this.props.fetchGroups();
    this.props.getMe();
    this.props.setPage('');
  }

  async handleSearchGroup(searchText) {
    console.log('search text', searchText);
    const groups = await Utils.search('groups', { name: searchText });
    let result = [];
    groups.map(g => {
      result.push({
        value: g.name,
        label: `Join: ${g.name}`,
      });
    })
    return result;
  }

  render() {
    const { classes, theme } = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <AsyncCreatableSelect
            classes={classes}
            styles={selectStyles}
            loadOptions={this.handleSearchGroup.bind(this)}
            components={components}
            onChange={this.handleCreateGroup.bind(this)}
            formatCreateLabel={(g) => { return `Create: ${g}` }}
          />
        </NoSsr>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  me: state.users.me,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGroups: () => dispatch(fetchGroups()),
    postGroup: (group) => dispatch(postGroup(group)),
    setPage: (page) => dispatch(setPage(page)),
    getMe: () => dispatch(getMe()),
  };
};

NewGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(NewGroup);
