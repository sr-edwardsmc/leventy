import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ImageCardProps {
  cardImageSrc: string;
  cardTitle: string;
  cardContent: string;
  handleClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  cardImageSrc,
  cardTitle,
  cardContent,
  handleClick,
}) => {
  return (
    <div
      className="cursor-pointer rounded-sm border w-[300px] h-[300px] flex flex-col border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      onClick={handleClick}
    >
      <div className="h-[70%] w-full relative">
        <Image
          src={"/" + cardImageSrc}
          alt="Cards"
          layout="fill"
          objectFit="cover"
          className="h-full w-full"
        />
      </div>

      <div className="px-3 py-1 h-[30%]">
        <h4 className="mb-1 text-md font-semibold text-black hover:text-primary dark:text-white dark:hover:text-primary cursor-pointer">
          {cardTitle}
        </h4>
        <p>{cardContent.slice(0, 60).concat("...")}</p>
      </div>
    </div>
  );
};

export default ImageCard;
