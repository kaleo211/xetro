import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Utils from './Utils';
import Items from './Items';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
});

class Pillars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaveButtonDisabled: [],
      newItems: {},
      expandedItem: "",
      ownerAnchorEl: {},
      newAction: "",
      selectedItem: null,
      progressTimer: null,
      itemProgress: 0,
      secondsPerItem: 30,
    }
  }

  componentWillReceiveProps(props) {
    let pillars = props.pillars;
    let isSaveButtonDisabled = [];

    if (pillars && pillars.length > 0) {
      // console.log("pillars in pillars:", pillars);
      let newItems = {};
      for (let idx = 0; idx < pillars.length; idx++) {
        let pillar = pillars[idx];
        let pillarHref = pillar._links.self.href;
        newItems[pillarHref] = "";
        isSaveButtonDisabled[pillarHref] = true;
      }
      this.setState({ newItems, isSaveButtonDisabled });
    }
  }

  handleNewItemSave(pillar, event) {
    if (event && event.key === 'Enter' && this.state.newItems[pillar] !== "") {
      let newItem = {
        title: this.state.newItems[pillar],
        pillar: pillar,
      }
      Utils.postResource("items", newItem, (data => {
        this.props.updatePillars();
        this.state.newItems[pillar] = "";
      }));
    }
  }

  handleNewItemChange(e) {
    let newItems = this.state.newItems;
    newItems[e.target.name] = e.target.value;
    this.setState(newItems);
  }

  render() {
    const { pillars, members, board } = this.props;

    return (
      <Grid
        container
        spacing={8}
        direction="row"
        justify="space-between"
        alignItems="stretch"
      >
        {pillars.map((pillar) => (
          <Grid item key={pillar.title} xs={12} sm={12} md={4} >
            <Card wrap='nowrap'>
              <CardHeader
                title={pillar.title}
                subheader={pillar.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={null}
              />
              <CardContent>
                <TextField
                  id="createNewItem"
                  fullWidth
                  key={pillar._links.self.href}
                  label="New item"
                  disabled={board && board.locked}
                  name={pillar._links.self.href}
                  value={this.state.newItems[pillar._links.self.href]}
                  onChange={this.handleNewItemChange.bind(this)}
                  onKeyPress={this.handleNewItemSave.bind(this, pillar._links.self.href)}
                />
              </CardContent>

              {pillar.items && pillar.items.map(item => (item &&
                <Items key={"item-" + item._links.self.href} board={board} item={item} members={members}
                  updatePillars={this.props.updatePillars} />
              ))}
            </Card>
          </Grid>
        ))}
      </Grid >
    )
  }
}

Pillars.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Pillars);
