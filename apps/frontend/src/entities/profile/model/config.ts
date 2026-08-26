import profilePhoto from "../../../shared/assets/profile-photo.png";

export interface ProfileInfo {
  firstName: string;
  lastName: string;
  profession: string;
  photoUrl: string;
  photoAlt: string;
  phone: string;
  email: string;
  telegram: string;
}

export const profile: ProfileInfo = {
  firstName: "Руслан",
  lastName: "Буданов",
  profession: "Fullstack-разработчик",
  photoUrl: profilePhoto,
  photoAlt: "Руслан Буданов",
  phone: "+7 (903) 571-73-70",
  email: "budz@yandex.ru",
  telegram: "@rubudaru",
};
