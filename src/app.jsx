import React   from 'react';
import $       from 'jquery'
import Player  from 'react-audio-player';
import { RotatingPlane } from 'better-react-spinkit';

export default class App extends React.Component {
  constructor(props) {
    super(props);
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
      url: 'http://localhost:3000',
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
      const message = messages[location[1]]; 
      if (message) {
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
              {messages.map((message, i) => 
                <li key={i}>
                  <a href={`/#/messages/${i}`}>Link</a>
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
                <div>
                  mode: {playerMode || 'playing'}
                  {'error' == playerMode ? (
                    <div>
                      Unable to play audio. Perhaps this message is made of cheese.
                    </div>
                  ) : (
                    <div>
                      <p>
                        {''+selected.url}
                      </p>
                      <div style={{margin: 0, padding: 0, position: 'fixed', left: 0, bottom: 0}}>
                        {'buffering' == playerMode && (
                          <div>
                            Buffering&hellip;
                          </div>
                        )}
                        <Player
                          src       = {selected.url} 
                          onCanPlay = {() => this.setState({playerMode: 'playing'})}
                          onError   = {() => this.setState({playerMode: 'error'})}
                          autoPlay
                        />
                      </div>
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
