import React   from 'react';
import $       from 'jquery'
import Player  from 'react-audio-player';
import { RotatingPlane } from 'better-react-spinkit';

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      messages: [],
      selected: null,
      error: false,
      fetching: false,
      playerMode: null        // 'playing' | 'buffering' | 'error'
    };
    window.addEventListener(
      'hashchange', 
      this.updateSelected.bind(this), 
      false
    );
  }
  fetchMessages() {
    this.setState({fetching: true});
    $.ajax({
      url: 'http://localhost:3003/messages',
      type: 'GET',
      crossDomain: true,
      success: (messages) => { 
        this.setState({messages});
        this.updateSelected(null, messages);
      },
      error: () => { console.error('Server unavailable.') },
      complete: () => this.setState({fetching: false})
    });
  }
  updateSelected(ev, messages) {
    if (!messages) {
      messages = this.state.messages;
    }
    const location = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
    if (location && location[0] === 'messages') {
      const id = location[1];
      let message = messages.filter(m => m.row === id);
      if (message.length) {
        message = message[0];
        if (!this.state.selected || this.state.selected.url != message.url) {
          this.setState({playerMode: 'buffering'});
        }
        this.setState({
          selected: message, 
          error: false
        });
      } else {
        this.setState({selected: null, error: true});
      }
    } else {
      // Default route
      this.setState({selected: null, error: false});
    }
  }
  componentDidMount() {
    this.fetchMessages();
  }
  render() {
    const { 
      connected, 
      error,
      fetching, 
      messages, 
      playerMode, 
      selected
    } = this.state;
    return (
      <div>
        {fetching ? (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95vh'}}>
            <RotatingPlane size={55} />
          </div>
        ) : (
          <div>
            <h1><a href='/#'>App</a></h1>
            <button onClick={() => this.fetchMessages()}>
              Load messages
            </button>
            <ul>
              {messages.map((message) => 
                <li key={message.row}>
                  <a href={`/#/messages/${message.row}`}>Link</a>
                  {JSON.stringify(message)}
                </li>
              )}
            </ul>
            {error ? (
              <div>
                Sorry, that message wasn't found. 
              </div>
            ) : (
              selected && (
                <div style={{background: '#ffffff', margin: 0, padding: 0, position: 'fixed', left: 0, bottom: 0}}>
                  mode: {playerMode || 'playing'}
                  {'error' == playerMode ? (
                    <div>
                      Unable to play audio. Perhaps this message is made of cheese.
                    </div>
                  ) : (
                    <div>
                      {'buffering' == playerMode && (
                        <div>
                          Buffering&hellip;
                        </div>
                      )}
                      {''+selected.url}
                      <Player
                        style     = {{width: '100vw'}}
                        src       = {selected.url} 
                        onCanPlay = {() => this.setState({playerMode: 'playing'})}
                        onError   = {() => this.setState({playerMode: 'error'})}
                        autoPlay
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }
}
