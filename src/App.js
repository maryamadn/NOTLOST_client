import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Pages/Misc/Layout";
import SignIn from "./Pages/Account/SignIn";
import SignUp from "./Pages/Account/SignUp";
import Settings from "./Pages/Account/Settings";
import About from "./Pages/Misc/About";
import Items from "./Pages/Items/Items";
// import LostItems from "./Pages/Items/LostItems";
import MyItems from "./Pages/Items/MyItems";
import EachItem from "./Pages/Items/EachItem";
import { useState } from "react";
function App() {
  const [user, setUser] = useState({});

  return (
    <div className="bg-base">

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />

          <Route path="/items" element={<Items user={user}/>} />
          <Route path="/myitems" element={<MyItems user={user}/>} />
          <Route path="/eachitem/:id" element={<EachItem user={user}/>} />
          <Route path="/settings" element={<Settings user={user} setUser={setUser}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
