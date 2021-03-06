import React, { Component } from "react";
import { RouteComponentProps, Link, useLocation } from "react-router-dom";

import Announcement from "../../libs/announcement";
import Query from "../../libs/query";

import { CompactAnnouncementComponent } from "../../components/Announcement";
import Pagination from "../../components/Pagination";

export interface FeedPageState {
  announcements: Announcement[],
  announcementsPagesCount: number,
  searchQuery: Query,
  currentPageNumber?: number
}

const RESULTS_LIMIT: number = 6;

export default class FeedPageComponent extends Component<any, FeedPageState> {
  constructor(props) {
    super(props);

    this.state = {
      announcements: [],
      announcementsPagesCount: 0,
      searchQuery: new Query(this.props.location.search),
      currentPageNumber: 1
    }
  }

  async componentWillReceiveProps(newProps) {
    const query = new Query(newProps.location.search);
    const pageNumber: number = query.get("page");

    query.remove("page");

    if (query != this.state.searchQuery) {
      const announcementsCount: number = await Announcement.getTotalCount(query.queries);
      const announcements: Announcement[] = await Announcement.find(query.queries, { limit: RESULTS_LIMIT, page: pageNumber });

      this.setState({
        announcements,
        announcementsPagesCount: Math.ceil(announcementsCount / RESULTS_LIMIT),
        searchQuery: query,
        currentPageNumber: pageNumber
      });
    }
  }

  async componentDidMount() {
    const pageNumber: number = this.state.searchQuery.get("page");
    const query = this.state.searchQuery;

    query.remove("page");

    const announcementsCount: number = await Announcement.getTotalCount(query.queries);
    const announcements: Announcement[] = await Announcement.find(query.queries, { limit: RESULTS_LIMIT, page: pageNumber });

    this.setState({
      announcements,
      announcementsPagesCount: Math.ceil(announcementsCount / RESULTS_LIMIT),
      searchQuery: query,
      currentPageNumber: pageNumber
    });
  }

  render() {
    return (
      <main className="feed-page">
        {
          ...this.state.announcements.map((announcement: Announcement, index: number) => (
              <CompactAnnouncementComponent key={`compact-announcement-${index}`} announcement={announcement} />
          ))
        }
        <Pagination
          pagesCount={this.state.announcementsPagesCount}
          currentPageNumber={this.state.currentPageNumber || 1}
          maxButtonsCount={10}
          linkTemplate={(page: number) => `/announcement/search${Query.createQuery({ ...this.state.searchQuery.queries, page: page })}`}
        />
      </main>
    );
  }
}
