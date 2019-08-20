import React from "react";
import PropTypes from "prop-types";

import Icon from "../../1-Atoms/Icon";

function Bookmark({ onDeleteBookmark, bookmark }) {
  try {
    const { title, url, id, thumbnail, excerpt, domain, wordCount } = bookmark;
    const scheme = url.substr(0, url.indexOf("://") + 3);

    return (
      <>
        <a
          href={url}
          className="bookmark_thumbnail"
          style={{ backgroundImage: `url(${thumbnail}` }}
        >
          {title}
        </a>
        <a href={url} className="bookmark_title">
          {title}
        </a>
        <div className="bookmark_extras">
          <a href={scheme + domain} className="bookmark_domain">
            {domain}
          </a>
          <span className="bookmark_reading-time">
            <Icon
              name="Clock"
              size={16}
              className="bookmark_reading-time_icon"
            />
            {Math.round(wordCount / 225)} min
          </span>
        </div>
        <p className="bookmark_excerpt">{excerpt}</p>
        <div className="bookmark_actions">
          <Icon
            name="Trash2"
            onClick={() => onDeleteBookmark(id)}
            className="bookmark_icon"
          />
        </div>
      </>
    );
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
    return null;
  }
}

Bookmark.propTypes = {
  onDeleteBookmark: PropTypes.func.isRequired,
  bookmark: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    wordCount: PropTypes.number.isRequired
  }).isRequired
};

export default Bookmark;
