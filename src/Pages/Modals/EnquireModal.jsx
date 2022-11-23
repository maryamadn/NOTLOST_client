import axios from "axios";
import { useEffect, useState } from "react";
import urlcat from "urlcat";

const SERVER = process.env.REACT_APP_SERVER;

const EnquireModal = ({ status, found_lost_by, type }) => {
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (found_lost_by !== undefined) {
      const url = urlcat(SERVER, `/users/${found_lost_by}`);

      axios.get(url).then(({ data }) => {
        setPhone(data.phone);
        setUserName(data.full_name);
      });
    }
  }, [found_lost_by]);
  return (
    <div className="text-xs sm:text-sm">
      <p>Hi!</p>
      <br />
      {status === "Unresolved" ? (
        <>
          {type === "Found" && (
            <>
              <p>
                If this item belongs to you and its returned to the Lost and
                Found Centre, please head to the centre. Bring along proof of
                ownership where applicable. Thank you!
              </p>
              <br />
              <p>
                Else, contact <span className="capitalize">{userName}</span> who
                created this item: {phone}
              </p>
            </>
          )}

          {type === "Lost" && (
            <p>
              If you know anything about the whereabouts of this item, contact{" "}
              <span className="capitalize">{userName}</span> who created this
              item: {phone}
            </p>
          )}
        </>
      ) : (
        <>
          <p>
            This item has been resolved. If you have any enquiries regarding
            this item, please head on to the Lost and Found Centre or contact
            us.
          </p>
          <br />
          <p>Else, contact the user that created this item: {phone}</p>
        </>
      )}

      <br />
      <p>
        Lost and Found Center
        <br />
        Insert Address Here
        <br />
        #00-00, 000000 NTU
      </p>
      <br />
      <p>6555 6555</p>
    </div>
  );
};

export default EnquireModal;
