import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";

import {
  CreateAnnouncementFormComponent,
  UpdateAnnouncementFormComponent,
  DeleteAnnouncementFormComponent
} from "../../components/Announcement";

import Announcement, { ExtendedAnnouncementProterties } from "../../libs/announcement";

interface AnnouncementPageState {
  announcement: Announcement
}

interface AnnouncementPageProps {
  id: string
}

export function AnnouncementPageComponent() {
  const ID = useParams<{id: string}>().id;
  return <AnnouncementPage id={ID} />;
}

export class AnnouncementPage extends Component<AnnouncementPageProps, AnnouncementPageState> {
  constructor(props) {
    super(props);

    this.state = {
      announcement: new Announcement()
    };
  }

  async componentDidMount() {
    const announcements: Announcement[] = await Announcement.find({ id: this.props.id });

    this.setState({
      announcement: announcements[0]
    });
  }

  render() {
    return (
      <main>
        <h1>{this.state.announcement.id}</h1>
        <Link to={`/announcement/update/${this.state.announcement.id}`}>update</Link>
        <DeleteAnnouncementFormComponent announcementId={this.state.announcement.id} />
      </main>
    );
  }
}

export class CreateAnnouncementPageComponent extends Component<any, any> {
  render() {
    return (
      <main>
        <CreateAnnouncementFormComponent />
      </main>
    );
  }
}

export interface UpdateAnnouncementPageComponentState {
  announcement: Announcement
}

export class UpdateAnnouncementPageComponent extends Component<any, UpdateAnnouncementPageComponentState> {
  constructor(props) {
    super(props);

    this.state = {
      announcement: new Announcement()
    };
  }

  async componentDidMount() {
    let announcements = await Announcement.find({ id: this.props.match.params.id});

    this.setState({
      announcement: announcements[0]
    });
  }

  render() {
    return (
      <main>
        <UpdateAnnouncementFormComponent announcement={this.state.announcement} />
      </main>
    );
  }
}
