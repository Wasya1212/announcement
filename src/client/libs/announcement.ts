import Axios from "axios";

import Query from "./query";

export interface AnnouncementProterties {
  title?: string,
  description?: string,
  category?: string,
  totalPrice?: number,
  author?: string,
  viewsCount?: number,
  id?: string,
  imageUrls?: string[],
  date?: Date
}

export interface ExtendedAnnouncementProterties extends AnnouncementProterties {
  pictures?: any[] | string[],
  oldPictures?: any[] | string[]
}

export interface SearchAnnouncementOptions {
  limit?: number,
  page?: number
}

export default class Announcement implements AnnouncementProterties {
  public id: string;
  public title: string;
  public description: string;
  public category: string;
  public totalPrice: number;
  public viewsCount: number;
  public imageUrls: string[];
  public date?: Date;

  constructor(props: AnnouncementProterties = {}) {
    this.id = props.id || "";
    this.title = props.title || "";
    this.description = props.description || "";
    this.category = props.category || "";
    this.viewsCount = props.viewsCount || 0;
    this.totalPrice = props.totalPrice || 0;
    this.imageUrls = props.imageUrls || [];
    this.date = props.date;
  }

  private static createSearchQuery(query: any = {}): string {
    return Query.createQueryFromParametersObject(query).slice(1);
  }

  public static async find(searchQuery: AnnouncementProterties = {}, searchOptions?: SearchAnnouncementOptions): Promise<Announcement[]> {
    const { data: results } = await Axios({
      method: 'GET',
      url: `/announcement?${this.createSearchQuery(searchQuery)}&${this.createSearchQuery(searchOptions)}`
    });

    return results.map((result: any) => new Announcement(result));
  }

  public static async getTotalCount(searchQuery: AnnouncementProterties = {}): Promise<number> {
    const { data } = await Axios({
      method: 'GET',
      url: `/announcement/count?${this.createSearchQuery(searchQuery)}`
    });

    return data;
  }

  public static async delete(id: string): Promise<boolean> {
    await Axios.delete(`/announcement/${id}`);
    return true;
  }

  public static async create(announcementData: AnnouncementProterties | ExtendedAnnouncementProterties): Promise<Announcement> {
    let formData: FormData = new FormData();

    Object.keys(announcementData).forEach((key: string) => {
      if (key == "pictures") {
        (announcementData[key] || []).forEach((picture: any, index: number) => {
          formData.append(`image-${index}`, picture);
        });
      } else if (typeof announcementData[key] == 'object') {
        formData.append(key, JSON.stringify(announcementData[key]));
      } else {
        formData.append(key, announcementData[key].toString());
      }
    });

    const { data } = await Axios.post(
      '/announcement',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return new Announcement(data);
  }

  public static async update(announcementData: AnnouncementProterties, announceId: string): Promise<boolean> {
    let formData: FormData = new FormData();

    Object.keys(announcementData).forEach((key: string) => {
      if (key == "pictures") {
        (announcementData[key] || []).forEach((picture: any, index: number) => {
          formData.append(`image-${index}`, picture);
        });
      } else if (typeof announcementData[key] == 'object') {
        formData.append(key, JSON.stringify(announcementData[key]));
      } else {
        formData.append(key, announcementData[key].toString());
      }
    });

    const { data } = await Axios.put(
      `/announcement/${announceId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return !!data;
  }
}
