import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Save from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlusOne from '@material-ui/icons/PlusOne';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Done from '@material-ui/icons/Done';
import Badge from '@material-ui/core/Badge';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MoreVert from '@material-ui/icons/MoreVert';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
  item: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 1,
  },
  itemDone: {
    textDecoration: "line-through",
  },
});

class Pillars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaveButtonDisabled: [],
      newItems: {},
      anchorEl: null,
      progress: {},
    }

    this.handleShowItemMenu = this.handleShowItemMenu.bind(this);
    this.handleCloseItemMenu = this.handleCloseItemMenu.bind(this);
  }

  componentWillReceiveProps(props) {
    let pillars = props.pillars;
    let isSaveButtonDisabled = [];

    if (pillars) {
      let newItems = {};
      for (let idx = 0; idx < pillars.length; idx++) {
        let pillar = pillars[idx]._links.self.href;
        newItems[pillar] = "";
        isSaveButtonDisabled[pillar] = true;
      }
      this.setState({ newItems, isSaveButtonDisabled });
    }
  }

  handleNewItemSave(idx, pillar, event) {
    let newItem = {
      title: this.state.newItems[pillar],
      pillar: pillar,
    }

    fetch("http://localhost:8080/api/item", {
      method: 'post',
      body: JSON.stringify(newItem),
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillar(idx);
        console.log("pillar save:", pillar);
        this.state.newItems[pillar] = "";
      } else {
        throw new Error('failed to post new item');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  handleItemDone(idx, item, event) {
    item.checked = true;
    fetch(item._links.self.href, {
      method: 'put',
      body: JSON.stringify(item),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillar(idx);
        this.handleCloseItemMenu();
      } else {
        console.log("failed to update item resp:", resp);
      }
    })
  }

  handleItemDelete(idx, item, event) {
    fetch(item._links.self.href, {
      method: 'delete',
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillar(idx);
        this.handleCloseItemMenu();
      } else {
        console.log("failed to delete item resp:", resp);
      }
    });
  }

  handleNewItemChange(e) {
    let newItems = this.state.newItems;
    newItems[e.target.name] = e.target.value;
    this.setState(newItems);

    if (e.target.value === "") {
      this.state.isSaveButtonDisabled[e.target.name] = true
    } else {
      this.state.isSaveButtonDisabled[e.target.name] = false
    }
  }

  handleShowItemMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleCloseItemMenu() {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes, pillars } = this.props;

    return (
      < Grid
        container
        spacing={8}
        direction="row"
        justify="space-between"
        alignItems="stretch" >
        {
          pillars.map((pillar, idx) => (
            < Grid item key={pillar.title} xs={12} sm={12} md={4} >
              <Card>
                <CardHeader
                  title={pillar.title}
                  subheader={pillar.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={null}
                />
                <CardContent>
                  <Grid
                    container
                    alignItems="baseline"
                    justify="space-evenly"
                  >
                    <Grid item xs={11} sm={9} md={10}>
                      <TextField
                        id="createNewItem"
                        key={pillar._links.self.href}
                        label="New item"
                        fullWidth
                        name={pillar._links.self.href}
                        value={this.state.newItems[pillar._links.self.href]}
                        onChange={this.handleNewItemChange.bind(this)}
                      />
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="primary"
                        disabled={this.state.isSaveButtonDisabled[pillar._links.self.href]}
                        aria-label="Add new item"
                        onClick={this.handleNewItemSave.bind(this, idx, pillar._links.self.href)}
                      >
                        <Save />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
                <List component="nav">
                  {
                    pillar.items && pillar.items.map(item => (
                      <div key={item.title} >
                        <Divider />
                        <ListItem button onClick={this.handleShowItemMenu}>
                          <ListItemText style={{ overflow: 'hidden' }} className={item.checked ? classes.itemDone : null} primary={item.title} />
                          <ListItemSecondaryAction>
                            <IconButton aria-label="Comments">
                              <Badge badgeContent={4} color="primary">
                                <MoreVert />
                              </Badge>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Menu
                          id="lock-menu"
                          anchorEl={this.state.anchorEl}
                          open={Boolean(this.state.anchorEl)}
                          onClose={this.handleCloseItemMenu}
                        >
                          <MenuItem>
                            <ListItemIcon>
                              <PlusOne />
                            </ListItemIcon>
                          </MenuItem>
                          <MenuItem onClick={this.handleItemDone.bind(this, idx, item)}>
                            <ListItemIcon>
                              <Done />
                            </ListItemIcon>
                          </MenuItem>
                          <MenuItem onClick={this.handleItemDelete.bind(this, idx, item)}>
                            <ListItemIcon>
                              <DeleteOutline />
                            </ListItemIcon>
                          </MenuItem>
                        </Menu>
                      </div>
                    ))
                  }
                </List>
              </Card>
            </Grid>
          ))
        }
      </Grid >
    )
  }
}

Pillars.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Pillars);
