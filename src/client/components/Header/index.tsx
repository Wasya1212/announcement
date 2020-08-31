import React, { Component } from "react";

import { Link } from "react-router-dom";

import { FindAnnouncementFormComponent } from "../Announcement";

export interface PageLink {
  text: string,
  url: string
}

export interface HeaderProps {
  pagesLinks?: PageLink[]
}

export const NavbarLink = (link: PageLink) => (
  <li>
    <Link to={link.url}>{link.text}</Link>
  </li>
);

export const CreateAnnouncementButton = () => (
  <section className="create-announcement-btn">
    <Link to="/announcement/create">create announcement</Link>
  </section>
);

export default class Header extends Component<HeaderProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className="header">
        <FindAnnouncementFormComponent />
        <CreateAnnouncementButton />
        <nav>
          {
            ...(this.props.pagesLinks || []).map(NavbarLink)
          }
        </nav>
      </header>
    );
  }
}
