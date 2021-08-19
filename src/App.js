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
      environmentID:"nzSwVvSBKPXat8gM6guipa",
      onChange: (oldFlags, params) => {  
        if (flagsmith.hasFeature('show_news_date')) {
          setShowNewsDate(!!flagsmith.getValue('show_news_date'));
        }
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
          <ul>
          {Array.isArray(stories) && stories.map(story => {
            const displayDate = story.published_date.substring(0, 16);
            return <li><a href={story.url} target="_blank" rel="noreferrer">{story.headline}</a> - {story.source} {showNewsDate ? '- '+ displayDate : ''}</li>
          })}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
