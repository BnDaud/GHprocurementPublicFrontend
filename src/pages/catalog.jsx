import { useContext, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Modal from "../components/modal";
import { globalContext } from "../App";

function Catalog() {
  const { catalogs } = useContext(globalContext);

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const [DisplayContent, setDisplayContent] = useState({});

  return (
    <>
      {modal && (
        <Modal toggleModal={toggleModal} DisplayContent={DisplayContent} />
      )}

      <div className="px-2  md:px-5 lg:px-20 lg:py-20 py-10 space-y-4">
        <div className="md:flex justify-between pt-4">
          <p className="text-xl font-bold w-20 md:w-50 h-15">Catalogs</p>
          <div className="flex gap-3 mt-5 md:mt-0 h-8 items-center">
            <input
              className="h-10 md:w-70 w-60 p-2 rounded-xl bg-white border-gray border"
              placeholder="Search posts, keywords..."
              readOnly
            />
            <div className="w-20 border-purple border hover:bg-purple hover:text-peach font-bold text-center p-2 rounded-xl cursor-pointer">
              Filter
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {catalogs && catalogs.length > 0 ? (
            catalogs.map((b) => (
              <div
                key={b.id}
                className="w-80 sm:w-70 relative bg-light/60 h-100 rounded-2xl shadow-md"
              >
                <img
                  src={b.featured_image}
                  alt={b.name}
                  className="h-1/2 w-full rounded-t-2xl object-cover"
                />
                <p className="px-2 text-xl font-bold mt-3">{b.name}</p>
                <p className="px-2 text-lg line-clamp-3 mt-5">
                  {b.description}
                </p>
                <p
                  className="absolute bottom-5 right-5 w-15 px-2 py-1 text-center hover:bg-purple hover:text-peach outline outline-purple text-purple rounded-xl cursor-pointer"
                  onClick={() => {
                    setDisplayContent(b);
                    toggleModal();
                  }}
                >
                  Read
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-80 bg-light/60 h-100 rounded-2xl shadow-md">
              <AiOutlineLoading3Quarters className="text-3xl text-purple animate-spin" />
              <p className="px-2 text-xl font-bold mt-5">Loading catalogs</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Catalog;
