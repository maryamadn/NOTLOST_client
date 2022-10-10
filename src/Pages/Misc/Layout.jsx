import { Outlet, useNavigate } from "react-router-dom";

const Layout = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <ul>
          {!user.id && (
            <>
              <li
                onClick={() => {
                  navigate("/");
                }}
              >
                SIGN IN
              </li>
              <li
                onClick={() => {
                  navigate("/signup");
                }}
              >
                SIGN UP
              </li>
              <li
                onClick={() => {
                  navigate("/about");
                }}
              >
                ABOUT
              </li>
            </>
          )}
          {user.id && (
            <>
              <li
                onClick={() => {
                  navigate("/founditems");
                }}
              >
                FOUND ITEMS
              </li>
              <li
                onClick={() => {
                  navigate("/lostitems");
                }}
              >
                LOST ITEMS
              </li>
              <li
                onClick={() => {
                  navigate("/myitems");
                }}
              >
                MY ITEMS
              </li>
              <li
                onClick={() => {
                  navigate("/about");
                }}
              >
                ABOUT
              </li>
              <li
                onClick={() => {
                  navigate("/");
                  setUser({});
                }}
              >
                LOGOUT
              </li>
            </>
          )}
        </ul>
      </div>
      <Outlet />
      <div>
        <p>©2022 Lost and Found</p>
      </div>
    </>
  );
};

export default Layout;
