using vite+react, tailwind, daisy ui, react-router for routing
<Outlet/> componenet sghould be added everywhere, where child compoenents have to be rendered in routing

ex:

<BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>

    const Body = () => {

return (

<div>
  <NavBar />
  <Outlet />
</div>
);
};
export default Body;
login
Body
Navbar
