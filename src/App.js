import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Pages/Misc/Layout";
import SignIn from "./Pages/Account/SignIn";
import SignUp from "./Pages/Account/SignUp";
import Settings from "./Pages/Account/Settings";
import Items from "./Pages/Items/Items";
import MyItems from "./Pages/Items/MyItems";
import EachItem from "./Pages/Items/EachItem";
import { useState } from "react";
import ErrorPage from "./Pages/Misc/ErrorPage";
function App() {
  const [user, setUser] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<SignIn user={user} setUser={setUser} />} />
          <Route path="/signup" element={<SignUp user={user} />} />

          <Route path="/items" element={<Items user={user}/>} />
          <Route path="/myitems" element={<MyItems user={user}/>} />
          <Route path="/eachitem/:id" element={<EachItem user={user}/>} />
          <Route path="/settings" element={<Settings user={user} setUser={setUser}/>} />
          <Route path="/error" element={<ErrorPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
