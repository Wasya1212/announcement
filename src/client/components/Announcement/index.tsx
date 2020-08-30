import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Announcement, { ExtendedAnnouncementProterties } from "../../libs/announcement";

export interface CreateAnnouncementPageComponentState {
  announcementTitle: string,
  announcementDescription: string,
  announcementCategory: string,
  announcementImages: any[],
  announcementPrice: number,
  loadedImages: (string | ArrayBuffer | null)[],
  submited: boolean
}

export interface CreateAnnouncementPageComponentProps {
  announcement?: Announcement
}

export interface CompactAnnouncementComponentProps {
  announcement: Announcement
}

export class CompactAnnouncementComponent extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="announcement">
        <header>
          <div><img src={this.props.announcement.imageUrls[0]} /></div>
          <h3>{this.props.announcement.title}</h3>
        </header>
        <section>
          <span>{this.props.announcement.date}</span>
          <span>{this.props.announcement.viewsCount}</span>
        </section>
      </article>
    );
  }
}

export interface DeleteAnnouncementFormComponentProps {
  announcementId: string
}

export interface DeleteAnnouncementFormComponentState {
  submited: boolean
}

export class DeleteAnnouncementFormComponent extends Component<DeleteAnnouncementFormComponentProps, DeleteAnnouncementFormComponentState> {
  constructor(props) {
    super(props);

    this.state = {
      submited: false
    };
  }

  handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await Announcement.delete(this.props.announcementId);
    this.setState({ submited: true });
  }

  render() {
    if (this.state.submited) {
      return <Redirect to="/" />;
    }

    return (
      <form onSubmit={this.handleSumbit}>
        <button>Delete</button>
      </form>
    );
  }
}

export interface FindAnnouncementFormComponentState {
  searchQuery: string,
  submited: boolean
}

export class FindAnnouncementFormComponent extends Component<any, FindAnnouncementFormComponentState> {
  constructor(props) {
    super(props);

    this.state = {
      submited: false,
      searchQuery: ''
    };
  }

  handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchQuery: e.currentTarget.value
    });
  }

  search = (e: React.FormEvent<HTMLButtonElement>) => {
    this.setState({ submited: true });
  }

  componentDidUpdate() {
    if (this.state.submited == true) {
      this.setState({ searchQuery: '', submited: false });
    }
  }

  render() {
    if (this.state.submited) {
      return <Redirect to={`/announcement/search?title=${this.state.searchQuery}`} />;
    }

    return (
      <form onSubmit={this.handleSumbit}>
        <input required onChange={this.handleChange} placeholder="Search..." />
        <button onClick={this.search}>find</button>
      </form>
    );
  }
}

export class CreateAnnouncementFormComponent extends Component<CreateAnnouncementPageComponentProps, CreateAnnouncementPageComponentState> {
  public static MAX_IMAGES_COUNT: number = 4;
  protected MAX_IMAGES_COUNT: number = CreateAnnouncementFormComponent.MAX_IMAGES_COUNT;

  state: CreateAnnouncementPageComponentState;

  constructor(props: any) {
    super(props);

    this.state = {
      announcementTitle: "",
      announcementDescription: "",
      announcementCategory: "electronic",
      announcementPrice: 0,
      announcementImages: [],
      loadedImages: [],
      submited: false
    }
  }

  handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  submitData = (e: React.FormEvent<HTMLButtonElement>) => {
    const newAnnouncement: ExtendedAnnouncementProterties = {
      title: this.state.announcementTitle,
      description: this.state.announcementDescription,
      category: this.state.announcementCategory,
      totalPrice: this.state.announcementPrice,
      pictures: this.state.announcementImages
    };

    e.currentTarget.disabled = true;

    Announcement
      .create(newAnnouncement)
      .then(() => {
        this.setState({ submited: true });
      });
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
    if (this.state.submited) {
      return <Redirect to="/" />;
    }

    return (
      <form onSubmit={this.handleSumbit} className="create-announcement-form">
        <input value={this.state.announcementTitle} name="announcementTitle" required placeholder="Title..." type="text" className="announcement-title-input" onChange={this.handleChange} />
        <textarea value={this.state.announcementDescription} name="announcementDescription" required placeholder="Description..." className="announcement-title-input" onChange={this.handleChange}></textarea>
        <select name="announcementCategory" onChange={this.handleChange} value={this.state.announcementCategory}>
          <option value="electronic">electronic</option>
          <option value="music">music</option>
          <option value="toys">toys</option>
          <option value="clothing">clothing</option>
        </select>
        <input value={this.state.announcementPrice} type="number" min="0" name="announcementPrice" onChange={this.handleChange} required placeholder="Price..." />
        <input accept="image/jpeg,image/png,image/gif" disabled={this.state.loadedImages.length >= this.MAX_IMAGES_COUNT} type="file" onChange={this.handleFileChange} />
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
        <button onClick={this.submitData}>Submit</button>
      </form>
    );
  }
}

export class UpdateAnnouncementFormComponent extends CreateAnnouncementFormComponent {
  constructor(props) {
    super(props);

    if (!this.props.announcement) {
      return;
    }


    this.state = {
      announcementTitle: this.props.announcement.title,
      announcementDescription: this.props.announcement.description,
      announcementCategory: this.props.announcement.category,
      announcementPrice: this.props.announcement.totalPrice,
      announcementImages: new Array(this.props.announcement.imageUrls.length).fill(false),
      loadedImages: this.props.announcement.imageUrls,
      submited: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      announcementTitle: nextProps.announcement.title,
      announcementDescription: nextProps.announcement.description,
      announcementCategory: nextProps.announcement.category,
      announcementPrice: nextProps.announcement.totalPrice,
      announcementImages: new Array(nextProps.announcement.imageUrls.length).fill(false),
      loadedImages: nextProps.announcement.imageUrls,
      submited: false
    });
  }

  submitData = (e: React.FormEvent<HTMLButtonElement>) => {
    const newAnnouncementInfo: ExtendedAnnouncementProterties = {
      title: this.state.announcementTitle,
      description: this.state.announcementDescription,
      category: this.state.announcementCategory,
      totalPrice: this.state.announcementPrice,
      pictures: this.state.announcementImages.filter(img => img != false),
      oldPictures: this.state.loadedImages.filter(img => (img || "").toString().length < 150)
    };

    e.currentTarget.disabled = true;

    Announcement
      .update(newAnnouncementInfo, (this.props.announcement || new Announcement()).id)
      .then(() => {
        this.setState({ submited: true });
      });
  }
}
