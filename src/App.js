import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    margin: theme.spacing.unit,
  },
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    marginLeft: '10%',
    marginRight: '10%',
  },
  table: {
    minWidth: 700,
  },
});

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      conversions: []
    }
  }

  componentWillMount() {
    fetch("http://localhost:5000/allConversions")
    .then(res => res.json())
    .then(data => {
      this.setState({
        conversions: data
      })
    })
  }

  render() {
    const { classes } = this.props;

    const listConversions = this.state.conversions.map((conversion) =>
      <TableRow key={conversion._id}>
        <TableCell>{conversion.date}</TableCell>
        <TableCell>{conversion.from}</TableCell>
        <TableCell>{conversion.to}</TableCell>
      </TableRow>
    );
    return (
      <div className="App">
        <header className="App-header">
          <h3>Roman Numerals Kata</h3>
        </header>

        <div>
          Converter
          <div>
            <Input
              placeholder="Enter value to convert"
            />
            <Button variant="contained" color="primary" className={classes.button}>Convert</Button>
          </div>
        </div>

        <hr/>

        <div>
          Recent Conversions
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {listConversions}
              </TableBody>
            </Table>
          </Paper>
        </div>

      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
