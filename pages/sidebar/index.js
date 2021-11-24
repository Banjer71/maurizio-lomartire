import React from "react";
import SocialMedia from "../social-media";
import Apple from "../../public/assets/itunes-128.png";
import Deezer from "../../public/assets/deezer-icon.jpg";
import Spotify from "../../public/assets/spotify1.png";

const SideBar = () => {
  return (
    <div className="sidebar">
      <SocialMedia
        icon1={Apple}
        icon2={Deezer}
        icon3={Spotify}
        alt="social-icon-image"
      />
    </div>
  );
};

export default SideBar;
