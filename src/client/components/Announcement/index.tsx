import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import Moment from "moment";

import Announcement, { ExtendedAnnouncementProterties } from "../../libs/announcement";

export interface CreateAnnouncementPageComponentState {
  announcementTitle: string,
  announcementDescription: string,
  announcementCategory: string,
  announcementImages: any[],
  announcementPrice: number,
  loadedImages: (string | ArrayBuffer | null)[],
  submited: boolean,
  sended: boolean
}

export interface CreateAnnouncementPageComponentProps {
  announcement?: Announcement
}

export interface CompactAnnouncementComponentProps {
  announcement: Announcement
}

export class CompactAnnouncementComponent extends Component<CompactAnnouncementComponentProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="compact-announcement">
        <header className="compact-announcement__head">
          <Link to={`/announcement/id/${this.props.announcement.id}`}>
            <div className="compact-announcement__preview"><img src={this.props.announcement.imageUrls[0]} /></div>
          </Link>
          <Link to={`/announcement/id/${this.props.announcement.id}`}>
            <div className="compact-announcement__title"><h3>{this.props.announcement.title}</h3></div>
          </Link>
          <div className="compact-announcement__price"><strong>{`${this.props.announcement.totalPrice ? this.props.announcement.totalPrice + " UAH" : "Free"}`}</strong></div>
        </header>
        <section className="compact-announcement__info">
          <span className="compact-announcement__info__category">{this.props.announcement.category}</span>
          <span className="compact-announcement__info__date">{Moment(this.props.announcement.date).format("Do MMM YYYY")}</span>
          <span className="compact-announcement__info__views">{this.props.announcement.viewsCount}</span>
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
      <form className="find-announcement find-announcement__form" onSubmit={this.handleSumbit}>
        <input className="find-announcement__input" required onChange={this.handleChange} placeholder="Search..." />
        <button className="find-announcement__button" onClick={this.search}>find</button>
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
      submited: false,
      sended: false
    }
  }

  handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.submitData();
  }

  submitData = () => {
    const newAnnouncement: ExtendedAnnouncementProterties = {
      title: this.state.announcementTitle,
      description: this.state.announcementDescription,
      category: this.state.announcementCategory,
      totalPrice: this.state.announcementPrice,
      pictures: this.state.announcementImages
    };

    this.setState({ sended: true });

    Announcement
      .create(newAnnouncement)
      .then(() => {
        this.setState({ sended: false, submited: true });
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

  private validateUnsigned(e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.keyCode || e.which;
    const regex = /[0-9]/;

    if( !regex.test(String.fromCharCode( key )) ) {
      //@ts-ignore
      e.returnValue = false;
      if(e.preventDefault) e.preventDefault();
    }
  }

  render() {
    if (this.state.submited) {
      return <Redirect to="/" />;
    }

    return (
      <form onSubmit={this.handleSumbit} className="create-announcement-form">
        <input className="create-announcement-form__input title-input" value={this.state.announcementTitle} name="announcementTitle" required placeholder="Title..." type="text" onChange={this.handleChange} />
        <textarea className="create-announcement-form__textarea description-input" value={this.state.announcementDescription} name="announcementDescription" required placeholder="Description..." onChange={this.handleChange}></textarea>
        <select className="create-announcement-form__select category-select" name="announcementCategory" onChange={this.handleChange} value={this.state.announcementCategory}>
          <option className="create-announcement-form__select__option" value="electronic">electronic</option>
          <option className="create-announcement-form__select__option" value="music">music</option>
          <option className="create-announcement-form__select__option" value="toys">toys</option>
          <option className="create-announcement-form__select__option" value="clothing">clothing</option>
        </select>
        <input  className="create-announcement-form__input phone-input" onKeyPress={this.validateUnsigned} value={this.state.announcementPrice} type="number" min="0" name="announcementPrice" onChange={this.handleChange} required placeholder="Price..." />
        <input  className="create-announcement-form___input load-image-input" accept="image/jpeg,image/png,image/gif" disabled={this.state.loadedImages.length >= this.MAX_IMAGES_COUNT} type="file" onChange={this.handleFileChange} />
        <article className="loaded-images-container">
          {
            ...this.state.loadedImages.map((img: any, index: number) => (
              <div key={`loaded-image-${index}`} className="loaded-image" id={`loaded-image-${index}`}>
                <img src={img} />
                <div className="remove-loaded-image-btn"><input type="button" onClick={() => {this.removeImageFromLoaded(index)}} value="x" /></div>
              </div>
            ))
          }
        </article>
        <div className="button-container">
          <button disabled={this.state.sended} className="create-announcement-form__submit-button submit-btn btn">Submit</button>
        </div>
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
      submited: false,
      sended: false
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
      submited: false,
      sended: false
    });
  }

  submitData = () => {
    const newAnnouncementInfo: ExtendedAnnouncementProterties = {
      title: this.state.announcementTitle,
      description: this.state.announcementDescription,
      category: this.state.announcementCategory,
      totalPrice: this.state.announcementPrice,
      pictures: this.state.announcementImages.filter(img => img != false),
      oldPictures: this.state.loadedImages.filter(img => (img || "").toString().length < 150)
    };

    this.setState({ sended: true });

    Announcement
      .update(newAnnouncementInfo, (this.props.announcement || new Announcement()).id)
      .then(() => {
        this.setState({ sended: false, submited: true });
      });
  }
}
