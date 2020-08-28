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
  announcementCategory: string,
  announcementImages: any[],
  announcementPrice: number,
  loadedImages: (string | ArrayBuffer | null)[]
}

export class CreateAnnouncementPageComponent extends Component<any, CreateAnnouncementPageComponentState> {
  public static MAX_IMAGES_COUNT: number = 4;
  private MAX_IMAGES_COUNT: number = CreateAnnouncementPageComponent.MAX_IMAGES_COUNT;

  state: CreateAnnouncementPageComponentState;

  constructor(props: any) {
    super(props);

    this.state = {
      announcementTitle: "",
      announcementDescription: "",
      announcementCategory: "electronic",
      announcementPrice: 0,
      announcementImages: [],
      loadedImages: []
    }
  }

  handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  createAnnouncement = async (e: React.FormEvent<HTMLButtonElement>) => {
    const newAnnouncement: AnnouncementProterties = {
      title: this.state.announcementTitle,
      description: this.state.announcementDescription,
      category: this.state.announcementCategory,
      totalPrice: this.state.announcementPrice,
      pictures: this.state.announcementImages
    };

    e.currentTarget.disabled = true;
    await Announcement.create(newAnnouncement);
  }

  handleChange = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLTextAreaElement>) => {
    let obj = Object.create(null);
    obj[e.currentTarget.name] = e.currentTarget.value || "";

    this.setState(obj);
  }

  handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) { return; }

    let file = e.currentTarget.files[0];
    let obj = Object.create(null);
    obj[`picture-${this.state.announcementImages.length}`] = e.currentTarget.files[0];

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
        <input name="announcementTitle" required placeholder="Title..." type="text" className="announcement-title-input" onChange={this.handleChange} />
        <textarea name="announcementDescription" required placeholder="Description..." className="announcement-title-input" onChange={this.handleChange}></textarea>
        <select name="announcementCategory" onChange={this.handleChange} value={this.state.announcementCategory}>
          <option value="electronic">electronic</option>
          <option value="music">music</option>
          <option value="toys">toys</option>
          <option value="clothing">clothing</option>
        </select>
        <input type="number" min="0" name="announcementPrice" onChange={this.handleChange} required placeholder="Price..." />
        <input disabled={this.state.announcementImages.length >= this.MAX_IMAGES_COUNT} type="file" onChange={this.handleFileChange} />
        <article className="loaded-images">
          {
            ...this.state.loadedImages.map((img: any, index: number) => (
              <div key={`loaded-image-${index}`} className="loaded-image">
                <img src={img} />
                <input type="button" onClick={() => {this.removeImageFromLoaded(index)}} value="remove" />
              </div>
            ))
          }
        </article>
        <button onClick={this.createAnnouncement}>Submit</button>
      </form>
    );
  }
}
