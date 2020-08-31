import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";

import ImageGallery from 'react-image-gallery';
import Moment from "moment";

import {
  CreateAnnouncementFormComponent,
  UpdateAnnouncementFormComponent,
  DeleteAnnouncementFormComponent,
  CompactAnnouncementComponent
} from "../../components/Announcement";

import Announcement, { TopSimilar } from "../../libs/announcement";

interface AnnouncementPageState {
  announcement: Announcement,
  similarAnnouncements: Announcement[]
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
      announcement: new Announcement(),
      similarAnnouncements: []
    };
  }

  async componentDidMount() {
    const topSimilarAnnouncements: TopSimilar = await Announcement.getTopSimilar(this.props.id, { limit: 3 })

    Announcement.makeViews(this.props.id);

    this.setState({
      announcement: topSimilarAnnouncements.announcement,
      similarAnnouncements: topSimilarAnnouncements.similarAnnouncements
    });
  }

  async componentWillReceiveProps(newProps) {
    if (this.props.id != newProps.id) {
      const topSimilarAnnouncements: TopSimilar = await Announcement.getTopSimilar(newProps.id, { limit: 3 })

      Announcement.makeViews(this.props.id);

      this.setState({
        announcement: topSimilarAnnouncements.announcement,
        similarAnnouncements: topSimilarAnnouncements.similarAnnouncements
      });
    }
  }

  render() {
    return (
      <main className="announcement-page">
        {
          this.state.announcement.imageUrls.length > 0
            ? <section className="announcement-page__galery">
                <ImageGallery
                  showThumbnails={false}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  items={this.state.announcement.imageUrls.map(i => ({original: i}))}
                />
              </section>
            : null
        }
        <section className="announcement-page__announcement-info">
          <header className="announcement-page__announcement-info__title-container">
            <h3 className="announcement-page__announcement-info__title">{this.state.announcement.title}</h3>
            <strong className="announcement-page__announcement-info__price">{this.state.announcement.totalPrice <= 0 ? "Free" : this.state.announcement.totalPrice + " UAH"}</strong>
          </header>
          <article className="announcement-page__announcement-info__description-container">
            <h4>Description</h4>
            {
              ...this.state.announcement.description.split('\n').map((p: string) => (
                <p className="announcement-page__announcement-info__description">{p}</p>
              ))
            }
          </article>
          <article className="announcement-page__announcement-info__additional-info-container">
            <span className="announcement-page__announcement-info__date">{Moment(this.state.announcement.date).format("Do MMM YYYY")}</span>
            <span className="announcement-page__announcement-info__views">Views: {this.state.announcement.viewsCount}</span>
          </article>
        </section>
        <section className="announcement-page__control">
          <Link className="announcement-page__control__update-button btn" to={`/announcement/update/${this.state.announcement.id}`}>update</Link>
          <DeleteAnnouncementFormComponent announcementId={this.state.announcement.id} />
        </section>
        <section className="announcement-page__top-announcements">
          <h4>Top similar announcements</h4>
          {
            ...this.state.similarAnnouncements.map((announcement: Announcement) => (
              <CompactAnnouncementComponent announcement={announcement} />
            ))
          }
        </section>
      </main>
    );
  }
}

export class CreateAnnouncementPageComponent extends Component<any, any> {
  render() {
    return (
      <main className="create-announcement-page">
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
      <main className="create-announcement-page">
        <UpdateAnnouncementFormComponent announcement={this.state.announcement} />
      </main>
    );
  }
}
