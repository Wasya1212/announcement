import React, { Component } from "react";

import Announcement, { AnnouncementProterties } from "../../libs/announcement";

export class AnnouncementPageComponent extends Component<any, any> {
  render() {
    return (
      <h1>Announcement page</h1>
    );
  }
}

export interface CreateAnnouncementPageComponentState {
  announcementTitle: string,
  announcementDescription: string,
  announcementImages: any[],
  loadedImages: (string | ArrayBuffer | null)[]
}

export class CreateAnnouncementPageComponent extends Component<any, CreateAnnouncementPageComponentState> {
  state: CreateAnnouncementPageComponentState;

  constructor(props: any) {
    super(props);

    this.state = {
      announcementTitle: "",
      announcementDescription: "",
      announcementImages: [],
      loadedImages: []
    }
  }

  handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  createAnnouncement = (e: React.FormEvent<HTMLButtonElement>) => {
    const newAnnouncement: AnnouncementProterties = {
      title: this.state.announcementTitle,
      description: this.state.announcementDescription,
      pictures: this.state.announcementImages
    };

    Announcement.create(newAnnouncement);
  }

  handleDescriptionChange = (e) => {
    this.setState({
      announcementDescription: e.currentTarget.value || ""
    });
  }

  handleTitleChange = (e) => {
    this.setState({
      announcementTitle: e.currentTarget.value || ""
    });
  }

  handleFileChange = (e) => {
    let file = e.target.files[0];
    let obj = {};
    obj[`picture-${this.state.announcementImages.length}`] = e.target.files[0];

    if (FileReader && e.target.files && e.target.files.length) {
      let fr: FileReader = new FileReader();

      fr.onload = () => {
        this.setState({
          loadedImages: [...this.state.loadedImages, fr.result],
          announcementImages: [...this.state.announcementImages, file]
        });
      }
      fr.readAsDataURL(e.target.files[0]);
    }
  }

  removeImageFromLoaded(imageIndex: number) {
    let loadedImages = this.state.loadedImages;
    let announcementImages = this.state.announcementImages;

    try {
      loadedImages.splice(imageIndex, 1);
      announcementImages.splice(imageIndex, 1);
    } catch (err) {
      console.error("Image for deleating is not founded!");
    }

    this.setState({ loadedImages, announcementImages });
  }

  render() {
    return (
      <form onSubmit={this.handleSumbit} className="create-announcement-form">
        <input type="text" className="announcement-title-input" onChange={this.handleTitleChange} />
        <textarea className="announcement-title-input" onChange={this.handleDescriptionChange}></textarea>
        <input type="file" onChange={this.handleFileChange} />
        <article className="loaded-images">
          {
            ...this.state.loadedImages.map((img: any, index: number) => (
              <div key={`loaded-image-${index}`} className="loaded-image">
                <img src={img} />
                <button onClick={() => {this.removeImageFromLoaded(index)}}>remove</button>
              </div>
            ))
          }
        </article>
        <button onClick={this.createAnnouncement}>Submit</button>
      </form>
    );
  }
}
