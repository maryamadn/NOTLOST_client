import axios from "axios";
import urlcat from "urlcat";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormatDate from "../../Components/FormatDate";
// import { IoIosCreate } from "react-icons/io";

const SERVER = process.env.REACT_APP_SERVER;

const MyItems = ({ user }) => {
  const [myItems, setMyItems] = useState([]);
  const [renderMyItems, setRenderMyItems] = useState(true);
  // const [isOpen, setIsOpen] = useState(false);
  // const [whatToOpen, setWhatToOpen] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const url = urlcat(SERVER, `/items/myitems/${user.id}`);

    axios
      .get(url)
      .then(({ data }) => {
        console.log(data);
        setMyItems(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [renderMyItems]);

  const handleEachItem = (id) => {
    navigate(`/eachitem/${id}`);
  };

  return (
    <>
    <p className="text-3xl text-center font-bold mb-20">My Items</p>
      <div className="grid grid-cols-3 place-content-center place-items-center">
        {myItems.msg ? (
          <div className="w-full cols-span-3 font-bold col-start-2 text-center">
          NO ITEMS FOUND
          </div>
        ) : (
          myItems.map((item, i) => (
            <div
            className="pb-20"
              key={i}
              onClick={() => {
                handleEachItem(item.id);
              }}
            >
              <div className="card w-fit h-fit bg-base-100 shadow-xl">
                <figure>
                  <img className="object-contain" src={item.photos[0].photo} />
                </figure>
                <div className="card-body bg-secondary-focus">
                  <h2 className="card-title capitalize font-medium">
                    {item.title}
                    <div className="ml-4 badge badge-accent uppercase font-medium">
                      {item.type}
                    </div>
                  </h2>
                  <p className="my-1 font-medium">
                    <FormatDate date={item.date_time} />
                  </p>
                  <div className="card-actions justify-items-start mt-4 grid grid-rows-2">
                    <div className="badge badge-outline">{item.category}</div>
                    <div className="badge badge-outline">
                      {item.subcategory}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyItems;
