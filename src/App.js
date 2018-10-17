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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


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
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  typography: {
    useNextVariants: true,
  },
});

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      conversions: [],
      inputValue: "",
      value: 'r2a'
    }
  }

  handleConversionChange = (event) => {
    this.setState({
      value: event.target.value
    })
  }

  onInputChange(event) {
    this.setState({
      inputValue: event.target.value
    })
  }

  convert(type) {
    fetch("http://localhost:5000/convert", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: type,
        number: `${this.state.inputValue}`
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Result: " + data.number)
      this.setState({
        result: data.number
      })
    })

    setTimeout(() => {
      this.fetchAllConversions()
    }, 1500);
  }

  fetchAllConversions() {
    fetch("http://localhost:5000/allConversions")
    .then(res => res.json())
    .then(data => {
      this.setState({
        conversions: data
      })
    })
  }

  componentWillMount() {
    this.fetchAllConversions()

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
            <FormControl component="fieldset" className={classes.formControl}>
              <RadioGroup
                aria-label=""
                name="ConvertOptions"
                className={classes.group}
                value={this.state.value}
                onChange={this.handleConversionChange}
              >
                <FormControlLabel value="r2a" control={<Radio />} label="Roman to Arabic" />
                <FormControlLabel value="a2r" control={<Radio />} label="Arabic to Roman" />
              </RadioGroup>
            </FormControl>

            <Input
              placeholder="Enter value to convert"
              value={this.state.inputValue}
              onChange={(e) => this.onInputChange(e)}
            />
            <Button variant="contained" color="primary" className={classes.button} onClick={() => this.convert(this.state.value)}>Convert</Button>
          </div>

          <div>

            Result: {this.state.result}

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
