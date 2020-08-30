import React, { Component } from "react";
import { Link } from "react-router-dom";

import Announcement from "../../libs/announcement";
import { CompactAnnouncementComponent } from "../../components/Announcement";

interface FeedPageComponentState {
  announcements: Announcement[]
}

export default class FeedPageComponent extends Component<any, FeedPageComponentState> {
  constructor(props) {
    super(props);

    this.state = {
      announcements: []
    }
  }

  componentWillReceiveProps(newProps) {
    const newQuery = newProps.match.params.query;
    const oldQuery = this.props.match.params.query;

    if (newQuery && newQuery != oldQuery) {
      Announcement.find({ title: newQuery.toString() }, { limit: 3 })
        .then((announcements: Announcement[]) => {
          this.setState({ announcements });
        });
    }
  }

  componentDidMount() {
    Announcement.find(
      this.props.match.params.query
        ? { title: this.props.match.params.query }
        : {},
      { limit: 3 }
    ).then((announcements: Announcement[]) => {
      this.setState({ announcements });
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
      </div>
    );
  }
}
