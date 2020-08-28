import Axios from "axios";

export interface AnnouncementProterties {
  title: string,
  description: string,
  category: string,
  pictures: any[],
  totalPrice: number
}

export default class Announcement {
  constructor() {

  }

  public static async create(announcementData: AnnouncementProterties) {
    let formData = new FormData();

    console.log(announcementData)

    formData.append("title", announcementData.title);
    formData.append("description", announcementData.description);
    formData.append("category", announcementData.category);
    formData.append("totalPrice", announcementData.totalPrice.toString());

    announcementData.pictures.forEach((picture: any, index: number) => {
      formData.append(`image-${index}`, picture);
      console.log(picture);
    });

    const { data } = await Axios.post(
      '/announcement',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Object.keys(announcementData).forEach((prop: string) => {
    //   if (announcementData[prop].lastModified || typeof announcementData[prop] !== 'object') {
    //     formData.append(prop, announcementData[prop]);
    //     console.log(announcementData);
    //   } else {
    //     formData.append(prop, JSON.stringify(announcementData[prop]));
    //   }
    // });

    console.log(announcementData)
  }
}
