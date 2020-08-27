import React, { Component } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { Page as AnnouncementPage, CreateAnnouncementPage } from "./pages/Announcement";
import { Page as FeedPage } from "./pages/Feed";
import { Page as ProfilePage } from "./pages/Profile";

import Header, { PageLink } from "./components/Header";

const PAGES: PageLink[] = [
  { url: '/', text: 'feed' },
  { url: '/profile', text: 'profile' },
  { url: '/announcement/id/3', text: 'announcement' }
]

export default class App extends Component<any, any> {
  render() {
    return (
      <Router>
        <main>
          <Header pagesLinks={PAGES}></Header>
        </main>
        <div>
          <Route path="/" exact component={FeedPage} />
          <Route path="/profile" exact component={ProfilePage} />
          <Route path="/announcement/id/:id" exact component={AnnouncementPage} />
          <Route path="/announcement/create" exact component={CreateAnnouncementPage} />
        </div>
      </Router>
    );
  }
}
