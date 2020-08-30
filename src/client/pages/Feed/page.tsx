import React, { Component } from "react";
import { RouteComponentProps, Link, useLocation } from "react-router-dom";

import Announcement from "../../libs/announcement";
import Query from "../../libs/query";

import { CompactAnnouncementComponent } from "../../components/Announcement";
import Pagination from "../../components/Pagination";

export interface FeedPageState {
  announcements: Announcement[],
  announcementsPagesCount: number,
  searchQuery: Query
}

export default class FeedPageComponent extends Component<any, FeedPageState> {
  constructor(props) {
    super(props);

    this.state = {
      announcements: [],
      announcementsPagesCount: 0,
      searchQuery: new Query(this.props.location.search)
    }
  }

  async componentWillReceiveProps(newProps) {
    const query = new Query(newProps.location.search);
    const pageNumber: number = query.get("page");

    query.remove("page");

    if (query != this.state.searchQuery) {
      const announcementsCount: number = await Announcement.getTotalCount(query.queries);
      const announcements: Announcement[] = await Announcement.find(query.queries, { limit: 3, page: pageNumber });

      this.setState({
        announcements,
        announcementsPagesCount: Math.ceil(announcementsCount / 3),
        searchQuery: query
      });
    }
  }

  async componentDidMount() {
    const pageNumber: number = this.state.searchQuery.get("page");
    const query = this.state.searchQuery;

    query.remove("page");

    const announcementsCount: number = await Announcement.getTotalCount(query.queries);
    const announcements: Announcement[] = await Announcement.find(query.queries, { limit: 3, page: pageNumber });

    this.setState({
      announcements,
      announcementsPagesCount: Math.ceil(announcementsCount / 3)
    });
  }

  render() {
    return (
      <div>
        {
          ...this.state.announcements.map((announcement: Announcement, index: number) => (
            <Link to={`/announcement/id/${announcement.id}`} key={`compact-announcement-${index}`}>
              <CompactAnnouncementComponent announcement={announcement} />
            </Link>
          ))
        }
        <Pagination
          pagesCount={this.state.announcementsPagesCount}
          currentPageNumber={1}
          maxButtonsCount={10}
          linkTemplate={(page: number) => `/announcement/search${Query.createQuery({ ...this.state.searchQuery.queries, page: page })}`}
        />
      </div>
    );
  }
}
