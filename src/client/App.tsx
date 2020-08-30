import React, { Component } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { Page as AnnouncementPage, CreateAnnouncementPage, UpdateAnnouncementPage } from "./pages/Announcement";
import { Page as FeedPage } from "./pages/Feed";

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
        <Header pagesLinks={PAGES}></Header>
        <div className="container">
          <Route path="/" exact component={FeedPage} />
          <Route path="/announcement/search" exact component={FeedPage} />
          <Route path="/announcement/id/:id" exact component={AnnouncementPage} />
          <Route path="/announcement/create" exact component={CreateAnnouncementPage} />
          <Route path="/announcement/update/:id" exact component={UpdateAnnouncementPage} />
        </div>
      </Router>
    );
  }
}
