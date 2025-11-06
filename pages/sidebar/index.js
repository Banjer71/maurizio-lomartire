import React from "react";
import SocialMedia from "../social-media";
// import Apple from "../../public/assets/itunes-128.png";
// import Deezer from "../../public/assets/deezer-icon.jpg";
// import Spotify from "../../public/assets/spotify1.png";

const SideBar = () => {
  const deezer = "/assets/deezer-icon.jpg";
  const spotify = "/assets/spotify1.png";
  const apple = "/assets/itunes-128.png";


  return (
    <div className="sidebar">
      <SocialMedia
        icon1={apple}
        icon2={deezer}
        icon3={spotify}
        alt="social-icon-image"
      />
    </div>
  );
};

export default SideBar;
