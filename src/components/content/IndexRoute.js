import React from 'react';
import axios from 'axios';
// This is a search bar to allow users to search for specific content by hitting return
import Search from '../common/Search';
// Auth contains functions that let us establish if a user is logged in, and allows us to log them in, out, and examine their token
import Auth from '../../lib/Auth';
// ResultsDisplay renders a list of content for the relevant mediatype
import ResultsDisplay from './ResultsDisplay';



//---------------------------------------//
class IndexRoute extends React.Component {

  state = {
    music: {},
    films: {},
    tv: {},
    musicSearch: '',
    musicSearchResults: [],
    filmsSearch: '',
    filmsSearchResults: [],
    tvSearch: '',
    tvSearchResults: []
  }

  handleContentSelection = (e) => {
    this.setState({ selectedContent: e.target.name });
    this.setState({ musicSearch: '' });
    this.setState({ filmsSearch: '' });
    this.setState({ tvSearch: '' });
  }

  handleMusicChange = (e) => {
    this.setState({ musicSearchResults: [] });
    this.setState({ musicSearch: e.target.value });
  }

  handleMusicSubmit = (e) => {
    e.preventDefault();

    axios.get('/api/spotify', {
      params: {
        q: this.state.musicSearch,
        type: 'track'
      },
      // Now that spotify is a secure route we need to add an authorization header to the request
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
      .then(res => this.setState({ musicSearchResults: res.data.tracks.items }));
  }

  handleFilmsChange = (e) => {
    this.setState({ filmsSearchResults: [] });
    this.setState({ filmsSearch: e.target.value });
  }

  handleFilmsSubmit = (e) => {
    e.preventDefault();

    axios.get('/api/tmdbmovies', {
      params: {
        query: this.state.filmsSearch
      },
      // Now that spotify is a secure route we need to add an authorization header to the request
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
      .then(res => this.setState({ filmsSearchResults: res.data.results }, () => console.log(this.state.filmsSearchResults)));
  }

  handleTvChange = (e) => {
    this.setState({ tvSearchResults: [] });
    this.setState({ tvSearch: e.target.value });
  }

  handleTvSubmit = (e) => {
    e.preventDefault();

    axios.get('/api/tmdbTv', {
      params: {
        query: this.state.tvSearch
      },
      // Now that spotify is a secure route we need to add an authorization header to the request
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
      .then(res => this.setState({ tvSearchResults: res.data.results }, () => console.log(this.state.tvSearchResults)));
  }

  componentDidMount() {
    if(!this.state.selectedContent) {
      this.setState({ selectedContent: 'music' });
      axios.get('/api/spotify/topMusic', {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
        .then(res => this.setState({ music: res.data }));

      axios.get('/api/tmdbmovies/topFilms', {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
        .then(res => this.setState({ films: res.data }));

      axios.get('/api/tmdbtv/topTv', {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
        .then(res => this.setState({ tv: res.data }));

      axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
        .then(res => this.setState({ users: res.data }));
    }
  }

  render() {

    return (
      <section>
        <div className="content-nav">
          <a
            className={this.state.selectedContent === 'music' ? 'content-nav-buttons-active' : 'content-nav-buttons'}
            onClick={this.handleContentSelection}
            name="music"
          >music</a> |
          <a
            className={this.state.selectedContent === 'films' ? 'content-nav-buttons-active' : 'content-nav-buttons'}
            onClick={this.handleContentSelection}
            name="films"
          > films</a> |
          <a
            className={this.state.selectedContent === 'tv' ? 'content-nav-buttons-active' : 'content-nav-buttons'}
            onClick={this.handleContentSelection}
            name="tv"
          > tv</a> |
          <a
            className={this.state.selectedContent === 'users' ? 'content-nav-buttons-active' : 'content-nav-buttons'}
            onClick={this.handleContentSelection}
            name="users"
          > users</a>
        </div>
        {this.state.selectedContent === 'music' &&
        <Search
          handleChange={this.handleMusicChange}
          handleSubmit={this.handleMusicSubmit}
        />
        }
        {this.state.selectedContent === 'films' &&
        <Search
          handleChange={this.handleFilmsChange}
          handleSubmit={this.handleFilmsSubmit}
        />
        }
        {this.state.selectedContent === 'tv' &&
        <Search
          handleChange={this.handleTvChange}
          handleSubmit={this.handleTvSubmit}
        />
        }


        {/* This section displays the music results in a list */}
        {this.state.music.items && !this.state.musicSearch && this.state.selectedContent === 'music' &&
        <ResultsDisplay music={this.state.music.items} />
        }

        {this.state.selectedContent === 'music' && this.state.musicSearch && this.state.musicSearchResults.length < 1 &&
        <h1>Search for your favourite track by typing it&apos;s name and hitting return...</h1>
        }

        {this.state.selectedContent === 'music' && this.state.musicSearch && this.state.musicSearchResults &&
          <ResultsDisplay music={this.state.musicSearchResults} />
        }


        {/* This section displays the films results in a list */}
        {this.state.films.results && !this.state.filmsSearch && this.state.selectedContent === 'films' &&
        <ResultsDisplay films={this.state.films.results} />
        }

        {this.state.selectedContent === 'films' && this.state.filmsSearch && this.state.filmsSearchResults.length < 1 &&
        <h1>Search for your favourite film by typing it&apos;s name and hitting return...</h1>
        }

        {this.state.selectedContent === 'films' && this.state.filmsSearch &&
          <ResultsDisplay films={this.state.filmsSearchResults} />
        }


        {/* This section displays the TV results in a list */}
        {this.state.tv.results && !this.state.tvSearch && this.state.selectedContent === 'tv' &&
          <ResultsDisplay tv={this.state.tv.results} />
        }

        {this.state.selectedContent === 'tv' && this.state.tvSearch && this.state.tvSearchResults.length < 1 &&
        <h1>Search for your favourite TV show by typing it&apos;s name and hitting return...</h1>
        }

        {this.state.selectedContent === 'tv' && this.state.tvSearch &&
          <ResultsDisplay tv={this.state.tvSearchResults} />
        }


        {/* This section displays all the users on the platform in a list */}
        {this.state.selectedContent === 'users' &&
          <ResultsDisplay users={this.state.users} />
        }
      </section>
    );
  }
}

export default IndexRoute;
