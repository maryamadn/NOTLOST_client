import { Link, Outlet, useNavigate } from "react-router-dom";

const Layout = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <div className="grid flex-col w-full min-h-screen">
      <div className="navbar text-xl bg-secondary max-h-20">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">
            <img className='h-full' src="https://i.imgur.com/jTemnoj.png"/>
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0 font-medium">
            {!user.id && (
              <>
                <li
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <a>SIGN IN</a>
                </li>
                <li
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  <a>SIGN UP</a>
                </li>
                <li
                  onClick={() => {
                    navigate("/about");
                  }}
                >
                  <a>ABOUT</a>
                </li>
              </>
            )}
            {user.id && (
              <>
                <li
                  onClick={() => {
                    navigate("/items");
                  }}
                >
                  <a>ITEMS</a>
                </li>
                <li
                  onClick={() => {
                    navigate("/myitems");
                  }}
                >
                  <a>MY ITEMS</a>
                </li>
                <li
                  onClick={() => {
                    navigate("/about");
                  }}
                >
                  <a>ABOUT</a>
                </li>
                <li tabIndex={0}>
                  <a>
                    MY ACCOUNT
                    <svg
                      className="fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </a>
                  <ul className="p-2 bg-base-100">
                    <li>
                      <a>

                      <Link to="/settings">SETTINGS</Link>
                      </a>
                    </li>
                    <li>
                      <a>
                        
                      <Link to="/" onClick={() => setUser({})}>LOGOUT</Link>
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="my-20">
      <Outlet/>
      </div>
      <div className="footer footer-center p-4 bg-secondary self-end">
        <p>©2022 NOTLOST</p>
      </div>
    </div>
  );
};

export default Layout;
