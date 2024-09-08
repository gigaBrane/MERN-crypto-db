// src/components/NewsCarousel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

const NewsCarousel = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        const parser = new window.DOMParser();
        const rss = parser.parseFromString(response.data, 'text/xml');
        const items = rss.querySelectorAll('item');

        // Parse RSS items to extract headline and first image
        const articlesData = Array.from(items).map(item => {
          const title = item.querySelector('title').textContent;
          const link = item.querySelector('link').textContent;
          let description = item.querySelector('description').textContent;

          // Strip HTML from the description and try to extract the first image
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = description;
          const image = tempDiv.querySelector('img') ? tempDiv.querySelector('img').src : null;
          const cleanDescription = tempDiv.textContent || tempDiv.innerText || '';

          return {
            title,
            link,
            image,
            description: cleanDescription
          };
        });

        setArticles(articlesData.slice(0, 5)); // Limit to top 5 articles
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,               // Enable autoplay
    autoplaySpeed: 3000,          // Set speed (3 seconds per slide)
  };

  return (
    <div className="news-carousel mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Latest News</h2>
      <Slider {...settings}>
        {articles.map((article, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg">
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 object-cover mb-4 rounded-lg"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsCarousel;
