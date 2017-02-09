import React from 'react';
import AudioPlayer from 'react-responsive-audio-player';
import { Router, Route, Link, browserHistory } from 'react-router';
import $ from 'jquery'

// ----------- test data -----------
const clips = [
  {
    id: '1',
    country: 'tz',
    url: '',
    length: '',
    gender: 'M',
    ageGroup: '12-25'
  },
  {
    id: '2',
    country: 'ke',
    url: '',
    length: '',
    gender: 'F',
    ageGroup: '25-35'
  },
  {
    id: '3',
    country: 'ug',
    url: '',
    length: '',
    gender: 'F',
    ageGroup: '35-55'
  }
];

const List = (props) =>
  <div>
    <h1><Link to='/'>Messages</Link></h1>
    <ul>
      {props.route.messages.map(message => 
        <li key={message.id}>
          <p>
            {message.country} {message.gender} <Link to={`/audio/${message.id}`}>Play</Link>
          </p>
        </li>
      )}
    </ul>
    {props.children}
  </div>

const Player = (props) => 
  <div style={{width: '100%', position: 'fixed', bottom: 0, left: 0}}>
    <Link to='/'>Close msg {props.params.id}</Link>
    <AudioPlayer playlist={[]} />
  </div>

function fetchMessages() {
  const opts = {crossDomain: true};
  $.get('http://localhost:3000', opts, (data) => {
    //console.log('-------------');
    //console.log(data);
  });
}

export default class App extends React.Component {
  render() {
    return (
      <div>
        <button onClick={fetchMessages}>
          Load messages
        </button>
        <Router history={browserHistory}>
          <Route path='/' component={List} messages={clips}>
            <Route path='audio/:id' component={Player} />
          </Route>
        </Router>
      </div>
    )
  }
}
