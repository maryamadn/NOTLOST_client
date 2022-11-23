import { Outlet, useNavigate } from "react-router-dom";

const Layout = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <div className="drawer w-full min-h-screen">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col justify-between">
        <div className="sticky top-0 z-10 w-full navbar text-xs sm:text-sm md:text-lg sm:p-4 md:p-6 font-medium bg-secondary">
          <div className="flex-none sm:hidden">
            <label htmlFor="navbar-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <p
              className="px-2 btn btn-ghost text-xs sm:text-sm md:text-lg"
              onClick={() => {
                navigate("/items");
              }}
            >
              NOTLOST
            </p>
          </div>
          <div className="flex-none hidden sm:block">
            <ul className="menu menu-horizontal">
              <li
                onClick={() => {
                  navigate("/items");
                }}
              >
                <p className="py-0 px-2">ITEMS</p>
              </li>
              {!user.id && (
                <>
                  <li
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    <p className="py-0 px-2">SIGN IN</p>
                  </li>
                  <li
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    <p className="py-0 px-2">SIGN UP</p>
                  </li>
                </>
              )}
              {user.id && (
                <>
                  <li
                    onClick={() => {
                      navigate("/myitems");
                    }}
                  >
                    <p className="py-0 px-2">MY ITEMS</p>
                  </li>
                  <li tabIndex={0}>
                    <p className="py-0 px-2">
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
                    </p>
                    <ul className="p-2 bg-base-100">
                      <li>
                        <p
                          onClick={() => {
                            navigate("/settings");
                          }}
                        >
                          SETTINGS
                        </p>
                      </li>
                      <li>
                        <p
                          onClick={() => {
                            setUser({});
                            navigate("/");
                          }}
                        >
                          LOGOUT
                        </p>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        {/* content */}
        <div className="my-8 sm:my-16 md:my-20">
          <Outlet />
        </div>
        <footer className="sticky bottom-0 z-10 footer footer-center p-4 bg-secondary text-xs">
          ©2022 NOTLOST 
        </footer>
      </div>

      {/* drawerside */}
      <div className="drawer-side">
        <label htmlFor="navbar-drawer" className="drawer-overlay"></label>
        <ul className="menu place-items-center font-medium p-4 w-36 sm:w-40 md:w-48 bg-secondary text-xs sm:text-sm md:text-lg">
          <li
            onClick={() => {
              navigate("/items");
            }}
          >
            <p>ITEMS</p>
          </li>
          {!user.id && (
            <>
              <li
                onClick={() => {
                  navigate("/");
                }}
              >
                <p>SIGN IN</p>
              </li>
              <li
                onClick={() => {
                  navigate("/signup");
                }}
              >
                <p>SIGN UP</p>
              </li>
            </>
          )}
          {user.id && (
            <>
              <li
                onClick={() => {
                  navigate("/myitems");
                }}
              >
                <p>MY ITEMS</p>
              </li>
              <li tabIndex={0}>
                <p className="">
                  MY ACCOUNT
                </p>
                <ul className="p-2 bg-base-100">
                  <li>
                    <p
                      onClick={() => {
                        navigate("/settings");
                      }}
                    >
                      SETTINGS
                    </p>
                  </li>
                  <li>
                    <p
                      onClick={() => {
                        setUser({});
                        navigate("/");
                      }}
                    >
                      LOGOUT
                    </p>
                  </li>
                </ul>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Layout;
