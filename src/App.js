import React, { useState, useEffect } from 'react';
import flagsmith from 'flagsmith';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const [stories, setStories] = useState([]);
  const [showNewsDate, setShowNewsDate] = useState(false);
  const [message, setMessage] = useState('loading...');
  useEffect(() => {
    async function fetchNewsStories () {
      try {
        await (await fetch('/api/fetch-news')).json();
        const data = await (await fetch('/api/news')).json();
        setStories(data)
        const message = data.length ? '' : 'No stories found';
        setMessage(message);
      } catch (err) {
        console.log(`err: ${err.mesasge}`, err);
        setMessage('could not fetch stories');
      }
    }
    fetchNewsStories();
    flagsmith.init({
      environmentID:"MayKLxpi95Xi4cKGL6NVGx",
      cacheFlags: true,
      enableAnalytics: true,
      onChange: (oldFlags, params) => {
        setShowNewsDate(flagsmith.hasFeature('show_published_date'));
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Latest News</h2>
        {message}
        <div className="stories">
        {Array.isArray(stories) && stories.map(story => {
          const displayDate = story.published_date ? story.published_date.substring(0, 16) : '';
          return <h3><a href={story.url} target="_blank" rel="noreferrer">{story.headline}</a> - {story.source} {showNewsDate && displayDate ? '- '+ displayDate : ''}</h3>
        })}
        </div>
      </header>
    </div>
  );
}

export default App;
