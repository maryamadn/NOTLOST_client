import axios from "axios";
import urlcat from "urlcat";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormatDate from "../../Components/FormatDate";

const SERVER = process.env.REACT_APP_SERVER;

const MyItems = ({ user }) => {
  const [myItems, setMyItems] = useState([]);
  const [renderMyItems, setRenderMyItems] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (user.id === undefined) {
      navigate("/error");
    } else {
      const url = urlcat(SERVER, `/items/myitems/${user.id}`);

      axios
        .get(url)
        .then(({ data }) => {
          setMyItems(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [renderMyItems]);

  const handleEachItem = (id) => {
    navigate(`/eachitem/${id}`);
  };

  return (
    <div className="grid justify-center gap-5">
      <p className="text-sm sm:text-lg md:text-xl text-center font-bold">
        MY ITEMS
      </p>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {myItems.msg ? (
          <div className="w-full cols-span-3 font-bold col-start-2 text-center text-xs sm:text-sm md:text-lg">
            No items found
          </div>
        ) : (
          myItems.map((item, i) => (
            <div
              className="w-fit h-fit place-self-center"
              key={i}
              onClick={() => {
                handleEachItem(item.id);
              }}
            >
              <div className="card w-40 sm:w-44 md:w-48 bg-base-100 shadow-xl">
                <figure>
                  <img className="object-contain" src={item.photos[0].photo} />
                </figure>
                <div className="card-body bg-secondary-focus p-5 sm:p-6 md:p-7">
                  <h2 className="grid card-title capitalize font-medium text-xs sm:text-sm md:text-lg">
                    <div className="truncate">{item.title}</div>
                    <div className="row-start-1 sm:col-start-2 md:ml-4 badge badge-accent uppercase font-medium text-[10px] sm:text-xs md:text-sm">
                      {item.type}
                    </div>
                  </h2>
                  <p className="my-1 font-medium text-[10px] sm:text-xs md:text-sm">
                    <FormatDate date={item.date_time} />
                  </p>
                  <div className="card-actions justify-items-start mt-4 grid grid-rows-2 font-medium">
                    <div className="badge badge-outline sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm truncate">
                      {item.category}
                    </div>
                    <div className="badge badge-outline sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm truncate">
                      {item.subcategory}
                    </div>
                    {item.status === "Resolved" ? (
                      <div className="badge badge-outline bg-green-700 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">
                        {item.status}
                      </div>
                    ) : (
                      <div className="badge badge-outline bg-red-700 sm:p-2 md:p-3 text-[10px] sm:text-xs md:text-sm">
                        {item.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyItems;
