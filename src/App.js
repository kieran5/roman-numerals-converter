import React, { Component } from 'react';
import './App.css';

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
    const listConversions = this.state.conversions.map((conversion) =>
      <tr key={conversion._id}>
        <td>{conversion.date}</td>
        <td>{conversion.from}</td>
        <td>{conversion.to}</td>
      </tr>
    );
    return (
      <div className="App">
        <header className="App-header">
          <h3>Roman Numerals Kata</h3>
        </header>

        <div>
          Converter
        </div>

        <div>
          Recent Conversions
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>

            <tbody>
              {listConversions}
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

export default App;
