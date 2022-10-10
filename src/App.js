import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Pages/Misc/Layout";
import SignIn from "./Pages/Account/SignIn";
import SignUp from "./Pages/Account/SignUp";
import Settings from "./Pages/Account/Settings";
import About from "./Pages/Misc/About";
import FoundItems from "./Pages/Items/FoundItems";
import LostItems from "./Pages/Items/LostItems";
import MyItems from "./Pages/Items/MyItems";
import EachItem from "./Pages/Items/EachItem";
import { useState } from "react";
function App() {
  const [user, setUser] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />

          <Route path="/founditems" element={<FoundItems />} />
          <Route path="/lostitems" element={<LostItems />} />
          <Route path="/myitems" element={<MyItems />} />
          <Route path="/eachitem" element={<EachItem />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
