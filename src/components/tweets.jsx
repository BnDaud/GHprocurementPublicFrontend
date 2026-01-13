import React, { useContext } from "react";
import { globalContext } from "../App";
import Logo from "../images/LogoW_B.png";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Tweets() {
  const { tweets } = useContext(globalContext);

  //console.log(tweets);

  const filterFile = (media, key) => {
    const attachment = media.filter((a) => a.media_key === key);

    if (attachment.length === 0) return null;

    return {
      type: attachment[0].type, // "photo" or "video"
      attachment, // full array of media objects
    };
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {tweets && tweets.data !== "Unable to fetch post" ? (
        tweets?.data?.map((tweet) => {
          const key = tweet?.attachments?.media_keys?.[0];
          const media = tweets?.includes?.media || [];

          // Only run filterFile once
          const file = key ? filterFile(media, key) : null;

          return (
            <div
              key={tweet.id}
              className="w-7/8 sm:w-70 relative bg-light/60 h-100 rounded-2xl shadow-md"
            >
              {file ? (
                <>
                  {/* PHOTO DISPLAY */}
                  {file.type === "photo" &&
                    file.attachment.map((img) => (
                      <img
                        key={img.media_key}
                        src={img.url}
                        alt=""
                        className="h-1/2 w-full rounded-t-2xl object-cover"
                      />
                    ))}

                  {/* VIDEO DISPLAY */}
                  {file.type === "video" &&
                    file.attachment.map((vid) => {
                      const mp4Variants =
                        vid.variants?.filter(
                          (v) => v.content_type === "video/mp4"
                        ) || [];

                      // Choose the best quality variant
                      const bestVariant = mp4Variants.sort(
                        (a, b) => (b.bit_rate || 0) - (a.bit_rate || 0)
                      )[0];

                      return (
                        <video
                          key={vid.media_key}
                          controls
                          loading="lazy"
                          preload="none"
                          className="h-1/2 w-full rounded-t-2xl object-contain"
                        >
                          {mp4Variants.map((v) => (
                            <source key={v.url} src={v.url} type="video/mp4" />
                          ))}
                        </video>
                      );
                    })}

                  {/* TWEET TEXT */}
                  <div className="text-lg pt-5 px-2 font-semibold line-clamp-5">
                    {tweet.text}
                  </div>
                </>
              ) : (
                <>
                  {/* FALLBACK WHEN NO MEDIA */}
                  <img
                    src={Logo}
                    alt=""
                    className="h-1/2 w-full rounded-t-2xl object-cover"
                  />
                  <div className="text-lg pt-5 px-2 font-semibold line-clamp-5">
                    {tweet.text}
                  </div>
                </>
              )}
              <a
                rel="noopener noreferrer"
                href={`https://x.com/ghprocure/status/${tweet.id}`}
                target="_blank"
              >
                {" "}
                <div className="absolute right-3 top-4 bg-purple text-peach px-2 py-1 rounded-lg cursor-pointer font-semibold">
                  View On X
                </div>
              </a>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center w-80 bg-light/60 h-100 rounded-2xl shadow-md">
          <AiOutlineLoading3Quarters className="text-3xl text-purple animate-spin" />
          <p className="px-2 text-xl font-bold mt-5">Fetching Api ....</p>
        </div>
      )}
    </div>
  );
}

export default Tweets;
