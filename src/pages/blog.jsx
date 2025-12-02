import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Modal from "../components/modal";
import { use } from "react";

function Blog() {
  const [blog, setBlogs] = useState([
    {
      title: "Skyview Horizon",
      image: "https://picsum.photos/seed/101/600",
      excerpt:
        "A sweeping landscape capturing the soft glow of the evening sun across the horizon.",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.`,
    },
    {
      title: "Urban Motion",
      image: "https://picsum.photos/seed/102/600",
      excerpt:
        "A glimpse of city life with dynamic lights, fast motion, and bustling streets.",
      content: `Vivamus hendrerit, sapien ac luctus mollis, nunc sem sagittis leo, id hendrerit magna 
    augue ut augue. Phasellus et urna id purus finibus sollicitudin. Sed facilisis sapien eget 
    sapien tincidunt, id tristique magna fermentum. Nullam sed mauris ac nibh dapibus vehicula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.
    Cras in ligula a nulla congue fermentum. Quisque eget lorem at odio sagittis malesuada. Donec 
    sed velit id nibh finibus cursus. Pellentesque habitant morbi tristique senectus et netus et 
    malesuada fames ac turpis egestas.`,
    },
    {
      title: "Silent Forest",
      image: "https://picsum.photos/seed/103/600",
      excerpt:
        "A calm and misty forest where the morning dew meets quiet rays of sunlight.",
      content: `Curabitur in diam ut quam fringilla sodales. Proin non velit at lacus luctus tincidunt. 
    Sed mattis magna sed risus suscipit, sed pretium neque imperdiet. Vestibulum eget risus sed 
    eros suscipit facilisis. Morbi dictum, orci sed pulvinar euismod, est sapien volutpat metus, 
    a sollicitudin magna lacus vel elit. Nam tincidunt, elit eget finibus venenatis, sapien odio Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.
    pretium sem, a sagittis massa magna a sapien. Integer eget sapien at mi porttitor luctus.`,
    },
    {
      title: "Oceanic Drift",
      image: "https://picsum.photos/seed/104/600",
      excerpt:
        "Rolling waves and cool tones of blue combine in a peaceful ocean atmosphere.",
      content: `Integer cursus eros vitae lacus blandit, vitae posuere leo eleifend. Nulla facilisi. 
    Aliquam erat volutpat. Suspendisse potenti. Cras sit amet diam nec dolor porttitor bibendum. 
    Donec pharetra justo vel nulla dictum, ut consequat turpis finibus. Sed congue dignissim Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac sapien nec nisi cursus 
    vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
    Sed fermentum sapien at metus imperdiet, sit amet aliquet libero viverra. Fusce sit amet felis 
    imperdiet, congue nisl vel, bibendum libero. Cras sagittis, elit vel mattis fermentum, libero 
    turpis bibendum libero, a vehicula nunc felis non mi. Curabitur a metus sit amet erat volutpat 
    lacinia. Suspendisse potenti. Sed luctus convallis tortor, ut euismod ex fermentum a.
    facilisis. Curabitur sed lectus sit amet erat bibendum tristique at sit amet lorem.`,
    },
    {
      title: "Rustic Heritage",
      image: "https://picsum.photos/seed/105/600",
      excerpt:
        "A vintage-style capture of an old-world structure with character and charm.",
      content: `Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis 
    egestas. Sed vel nisi sed risus iaculis hendrerit a nec ex. Maecenas congue, nibh id egestas 
    cursus, lacus nisi dignissim justo, vel rutrum mi orci at risus. Cras eu orci non purus 
    tincidunt tempor. Fusce finibus urna vitae diam laoreet, ut sagittis sem fermentum.`,
    },
    {
      title: "Neon District",
      image: "https://picsum.photos/seed/106/600",
      excerpt:
        "Bright neon lights reflect on wet streets in a futuristic urban setting.",
      content: `Suspendisse lacinia tortor vel ligula sollicitudin, nec congue metus viverra. 
    Phasellus at odio a metus feugiat porttitor. Donec imperdiet justo eget fermentum venenatis. 
    Ut id turpis et lacus ultricies tincidunt. Maecenas sodales purus a magna rhoncus, ut gravida 
    arcu faucibus. Integer pharetra sapien nec metus consequat, eget vulputate lorem gravida.`,
    },
    {
      title: "Desert Mirage",
      image: "https://picsum.photos/seed/107/600",
      excerpt:
        "Golden sands merge with the heat of the day, creating a surreal desert illusion.",
      content: `Aliquam erat volutpat. Nam vel sapien in magna consectetur finibus. Integer vitae 
    metus sed libero fermentum tincidunt. Vivamus vitae leo sed mauris lacinia fringilla. Cras 
    imperdiet, ligula id congue fermentum, justo odio venenatis odio, eget commodo justo nulla 
    vitae sapien. Ut vel sapien vitae nisi dignissim tincidunt.`,
    },
    {
      title: "Snowbound Peaks",
      image: "https://picsum.photos/seed/108/600",
      excerpt:
        "Snow-covered mountains stand tall under a crisp and clear winter sky.",
      content: `Morbi sed nisi nec libero hendrerit vulputate. Sed ut risus ac sapien tempor 
    vulputate. Fusce ultricies erat a mi bibendum, a lacinia eros viverra. Donec at odio non 
    neque tristique dictum. Pellentesque habitant morbi tristique senectus et netus et 
    malesuada fames ac turpis egestas.`,
    },
    {
      title: "Garden Bloom",
      image: "https://picsum.photos/seed/109/600",
      excerpt:
        "Soft petals and bright colors define this vibrant botanical scene.",
      content: `Fusce vitae mi vel sapien dignissim commodo. Maecenas facilisis sapien sed tellus 
    fermentum, a scelerisque purus congue. Quisque id ex et nisl porttitor luctus. Vivamus 
    ultrices, leo a laoreet venenatis, risus felis feugiat nisl, sed pharetra justo augue id 
    tortor. Curabitur congue nisl sed massa fermentum tincidunt.`,
    },
    {
      title: "Nightfall Alley",
      image: "https://picsum.photos/seed/110/600",
      excerpt:
        "A quiet alleyway illuminated by scattered lanterns under the night sky.",
      content: `Proin faucibus purus at mauris cursus, vel facilisis nulla fermentum. Nam fermentum 
    orci a sapien laoreet, non volutpat turpis ultricies. Nulla facilisi. Sed vitae velit nec 
    lectus posuere dignissim. Pellentesque habitant morbi tristique senectus et netus et 
    malesuada fames ac turpis egestas.`,
    },
  ]);

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  const [DisplayContent, setDisplayContent] = useState({});

  return (
    <>
      {modal ? (
        <Modal toggleModal={toggleModal} DisplayContent={DisplayContent} />
      ) : null}
      <div className=" px-6 md:px-20 pb-20 space-y-4">
        <div className="flex justify-between pt-4">
          <p className="text-xl font-bold w-20 md:w-50 h-15">Blog & Insights</p>{" "}
          <div className="flex gap-2 h-8 items-center">
            {" "}
            <input
              className="h-10 w-60 p-2 rounded-xl  bg-white border-gray border"
              placeholder="Search posts, keywords..."
            />{" "}
            <div className="w-20 border-purple border hover:bg-purple hover:text-peach font-bold text-center p-2 rounded-xl cursor-pointer">
              {" "}
              Filter
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center ">
          {blog ? (
            blog.map((b) => {
              return (
                <div className="w-80 sm:w-70 relative bg-light/60 h-100 rounded-2xl shadow-md">
                  <img
                    src={b.image}
                    alt="blog img"
                    className="h-1/2 w-full  rounded-t-2xl object-cover"
                  />
                  <p className="px-2 text-xl font-bold"> {b.title}</p>{" "}
                  <p className="px-2 text-lg break-all  mt-5">{b.excerpt}</p>
                  <p
                    className="absolute bottom-5 right-5 w-15 px-2 py-1  text-center hover:bg-purple hover:text-peach outline outline-purple text-purple rounded-xl cursor-pointer"
                    onClick={() => {
                      setDisplayContent(b);
                      toggleModal();
                    }}
                  >
                    {" "}
                    Read
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center w-80  bg-light/60 h-100 rounded-2xl shadow-md">
              <AiOutlineLoading3Quarters className="text-3xl text-purple animate-spin" />
              <p className="px-2 text-xl font-bold mt-5"> Please Wait</p>{" "}
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
}

export default Blog;
