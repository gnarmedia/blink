import React, { Component } from "react";
import { AppConfig, UserSession } from "blockstack";
import shortUUID from "short-uuid";
import axios from "axios";

import Header from "../Header";
import BookmarksList from "../BookmarksList";
import AddBookmarks from "../AddBookmarks";

import "../../assets/styles/index.scss";
import { ReactComponent as Logo } from "../../assets/images/agenda.svg";

const appConfig = new AppConfig(["store_write", "publish_data"]);

const userSession = new UserSession({ appConfig });

export default class App extends Component {
  constructor(props) {
    super(props);

    const isUserSignedIn = this.isUserSignedIn();

    this.state.isUserSignedIn = isUserSignedIn;
  }

  state = {
    isUserSignedIn: false,
    bookmarks: undefined,
    isLoaded: false,
    isShowingAddbookmark: false,
    errorMsg: null
  };

  async componentDidMount() {
    if (!this.isUserSignedIn()) {
      return false;
    }

    // get bookmarks.json
    userSession.getFile("bookmarks.json").then(data => {
      try {
        const bookmarks = JSON.parse(data);
        this.setState({
          bookmarks,
          isLoaded: true
        });
      } catch (e) {
        this.setState({
          errorMsg: "Error parsing bookmarks from Blockstack"
        });
        console.trace(e);
      }
    });
  }

  isUserSignedIn() {
    if (userSession.isUserSignedIn()) {
      return true;
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(function() {
        window.location = window.location.origin;
      });
      return false;
    }
  }

  saveBookmarks(bookmarks) {
    userSession
      .putFile("bookmarks.json", JSON.stringify(bookmarks))
      .then(result => {
        this.setState({ bookmarks });
      });
  }

  handleSignIn() {
    userSession.redirectToSignIn();
  }

  handleSignOut() {
    userSession.signUserOut(window.location.origin);
  }

  handleAddBookmark = async ({ url }) => {
    try {
      const res = await axios
        .post(
          "/extract", { url }
        );
      const bookmark = res.data;

      bookmark.id = shortUUID.generate();
  
      const { bookmarks } = this.state;
      const newBookmarks = [bookmark, ...bookmarks];

      this.saveBookmarks(newBookmarks);
    }
    catch (e) {
      console.trace('addBookmarkError:', e);
    }
  };

  handleDeleteBookmark = idToDelete => {
    const bookmarks = this.state.bookmarks.filter(
      ({ id }) => id !== idToDelete
    );

    this.saveBookmarks(bookmarks);

    this.setState({ bookmarks });
  };

  handleShowAddBookmark = () => {
    this.setState({ isShowingAddbookmark: true });
  };

  handleHideAddBookmark = () => {
    this.setState({ isShowingAddbookmark: false });
  };

  renderBookmarkList() {
    const { bookmarks, isLoaded, isShowingAddbookmark, errorMsg } = this.state;

    if (errorMsg) {
      return errorMsg;
    }

    if (!isLoaded) {
      return "loading...";
    }

    const bookmarksList =
      bookmarks && Array.isArray(bookmarks) && bookmarks.length > 0 ? (
        <BookmarksList
          bookmarks={bookmarks}
          onDeleteBookmark={this.handleDeleteBookmark}
        />
      ) : (
        "no bookmarks"
      );

    return (
      <main className="main">
        {isShowingAddbookmark && (
          <AddBookmarks
            onSubmit={this.handleAddBookmark}
            handleHideAddBookmarks={this.handleHideAddBookmark}
          />
        )}
        {bookmarksList}
      </main>
    );
  }

  render() {
    const isUserSignedIn = this.isUserSignedIn();

    if (!isUserSignedIn) {
      return (
        <>
          <div className="container full">
            <div className="logo-container">
              <Logo className="logo" />
              <h1 className="logo-title">Blink</h1>
            </div>
            <button className="button" onClick={this.handleSignIn}>
              Sign in with Bockstack
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="container">
          <Header
            isSignedIn={isUserSignedIn}
            handleSignIn={this.handleSignIn}
            handleSignOut={this.handleSignOut}
            handleShowAddBookmark={this.handleShowAddBookmark}
          />
          {this.renderBookmarkList()}
        </div>
        {/* <div>
          Icons made by{" "}
          <a href="https://www.freepik.com/" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>{" "}
          is licensed by{" "}
          <a
            href="http://creativecommons.org/licenses/by/3.0/"
            title="Creative Commons BY 3.0"
            target="_blank"
          >
            CC 3.0 BY
          </a>
        </div>{" "} */}
      </>
    );
  }
}
