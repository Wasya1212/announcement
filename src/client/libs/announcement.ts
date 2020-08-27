import Axios from "axios";

export interface AnnouncementProterties {
  title: string,
  description: string,
  pictures: any[]
}

export default class Announcement {
  constructor() {

  }

  public static async create(announcementData: AnnouncementProterties) {
    const formData = new FormData();

    // formData.append("title", announcementData.title);
    // formData.append("description", announcementData.description);
    // formData.append("category", announcementData.category);

    announcementData.pictures.forEach((picture: any, index: number) => {
      formData.append(`image-${index}`, picture);
      console.log(picture);
    });

    const { data } = await Axios.post(
      'http://localhost:5000/announcement',
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
