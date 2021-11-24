import React from "react";
import Image from "next/image";

const SocialMedia = ({ icon1, icon2, icon3, alt }) => {
  return (
    <div className="social-media-wrapper">
      <ul className="social-media icon">
        <li className="media">
          <Image src={icon1} alt={alt} />
        </li>
        <li className="media">
          <Image src={icon2} alt={alt} />
        </li>
        <li className="media">
          <Image src={icon3} alt={alt} />
        </li>
      </ul>
    </div>
  );
};

export default SocialMedia;
