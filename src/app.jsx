import React from 'react';
import AudioPlayer from 'react-responsive-audio-player';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div>
          <ul>
            <li>Audio #1</li>
            <li>Audio #2</li>
            <li>Audio #3</li>
            <li>Audio #4</li>
          </ul>
        </div>
        <div style={{width: '100%', position: 'fixed', bottom: 0, left: 0}}>
          <AudioPlayer playlist={[]} />
        </div>
      </div>
    )
  }
}
