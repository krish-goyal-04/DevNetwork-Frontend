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

we are using axios for calling api (HTTP api calls). it is a 3rd party npm library
The Fetch API is a built-in JavaScript feature available in modern browsers. It provides a simple way to make network requests using the fetch() method, which is part of the window object. This method returns a Promise that resolves with the response to the request.

Axios is a third-party JavaScript library designed for making HTTP requests. It works with both Node.js and browsers. Like Fetch, Axios uses the Promise API introduced in ES6. Axios is known for its simplicity and extra features, such as request/response interception, error handling, and support for cancellation.

CORS - Cros origin resource sharing
it avoids resource sharing between 2 different domain,ports,origins,or if 2 resource using different protocols.
it uses extra headers for security of this cross origin data transfer
A preflight call is made from one origin to other, which means an aditional call is made before data sharing and the other server which has to share data verifies the req and returns some aditional http header specifying wether the data can be exchanged ot not
CORS (Cross-Origin Resource Sharing) — Full Notes
1️⃣ What is CORS?
CORS (Cross-Origin Resource Sharing) is a browser security mechanism
It allows or restricts requests from one origin to another
Controlled using HTTP headers sent by the server

👉 Works along with
Same-Origin Policy

2️⃣ What is an Origin?

An origin = protocol + domain + port

Examples:

http://localhost:3000
http://localhost:5000 ❌ (different port → different origin)
https://google.com ❌ (different domain + protocol)

👉 Even a small difference = different origin

3️⃣ Same-Origin Policy (SOP)

Browser rule:

Only allow requests within the same origin

Why SOP exists:
Prevents malicious websites from:
Stealing user data
Accessing cookies/tokens
Performing unauthorized actions
4️⃣ Why CORS is Needed?

Modern apps use:

React frontend → localhost:3000
Backend API → localhost:5000

👉 SOP blocks this by default ❌

So we use CORS to explicitly allow it ✅

5️⃣ How CORS Works (Flow)
Step 1: Browser sends request

Includes header:

Origin: http://localhost:3000
Step 2: Server responds with CORS headers
Access-Control-Allow-Origin: http://localhost:3000
Step 3: Browser checks
If origin matches → ✅ allow response
If not → ❌ block response
6️⃣ Important CORS Headers
🔹 1. Access-Control-Allow-Origin
Defines allowed origin(s)
Access-Control-Allow-Origin: \*

👉 \* = allow all (not safe for production)

🔹 2. Access-Control-Allow-Methods
Allowed HTTP methods
GET, POST, PUT, DELETE
🔹 3. Access-Control-Allow-Headers
Allowed custom headers
Content-Type, Authorization
🔹 4. Access-Control-Allow-Credentials
Allows cookies/auth headers
Access-Control-Allow-Credentials: true

⚠️ Cannot use \* with credentials

7️⃣ Simple vs Preflight Requests
✅ Simple Requests

Conditions:

Methods: GET, POST, HEAD
Standard headers only

👉 Sent directly

⚠️ Preflight Requests (IMPORTANT for interviews)
Browser sends an OPTIONS request first
Checks if actual request is safe
OPTIONS /api

Server responds:

Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type

👉 If allowed → actual request is sent

8️⃣ Why Postman Works but Browser Fails?
Postman does NOT enforce CORS
Browser DOES enforce CORS

👉 That’s why:

“API works in Postman but not in browser”

9️⃣ Common Errors
❌ Error:

No 'Access-Control-Allow-Origin' header present

👉 Fix:

Enable CORS in backend
❌ Credentials error:

Cannot use '\*' with credentials

👉 Fix:

origin: "http://localhost:3000",
credentials: true
🔟 How to Enable CORS (Node.js / Express)

Using cors:

npm install cors
const cors = require("cors");

app.use(cors({
origin: "http://localhost:3000",
credentials: true
}));
1️⃣1️⃣ Security Considerations

Never blindly use:

Access-Control-Allow-Origin: \*
Restrict to trusted domains
Be careful when enabling credentials
1️⃣2️⃣ Real-World Example

Frontend:

fetch("http://api.com/data")

Backend must allow:

Access-Control-Allow-Origin: http://frontend.com
🧠 Interview One-Liner

CORS is a browser security feature that allows servers to specify which origins are permitted to access their resources using HTTP headers.

🚀 Quick Revision Summary
CORS = permission system for cross-origin requests
Enforced by browser, not backend
Based on HTTP headers
Uses preflight (OPTIONS) for unsafe requests
Needed because of Same-Origin Policy
What is Access-Control-Allow-Origin?

👉 It is a response header sent by the server

👉 It tells the browser:

“Which frontend (origin) is allowed to access me”

🧠 Think of it like permission
Frontend = person requesting entry
Backend = building
Browser = security guard

👉 Access-Control-Allow-Origin = entry pass

🔥 Example (Super Simple)
Your frontend:
fetch("http://localhost:5000/data")

👉 Browser sends request with:

Origin: http://localhost:3000
Now server must reply with:
Access-Control-Allow-Origin: http://localhost:3000
✅ What happens next?
Browser compares:
Request origin → 3000
Allowed origin → 3000

👉 Match → ✅ allow data

❌ If server sends:
Access-Control-Allow-Origin: http://someother.com

👉 Mismatch → ❌ browser blocks response

💥 If header is missing completely

👉 Browser error:

No 'Access-Control-Allow-Origin' header present

👉 Means:

Server didn’t give permission at all

🌍 Special Case: _ (Wildcard)
Access-Control-Allow-Origin: _

👉 Means:

“Anyone can access this API”

⚠️ But:
Not safe for private APIs
Cannot be used with login/cookies
⚙️ Real Backend Code (Express)

Using cors:

app.use(cors({
origin: "http://localhost:3000"
}));

👉 This automatically sends:

Access-Control-Allow-Origin: http://localhost:3000
🧠 Why browser cares about this?

Because of
Same-Origin Policy

👉 Without this header:

Any website could steal your data 😬
🧩 One-Line Understanding

Access-Control-Allow-Origin = server telling browser “these origins are allowed to access my data”

⚡ Quick Analogy
You knock on a door (API request)
Guard asks: “Where are you from?”
Owner says:
✅ “Let them in” → header matches
❌ “Not allowed” → blocked

install CORS npm package in backend
add middleware cors and set origin and credentials:true
and in frontend pass withcredentials:true
If you are using axios, it wont allow unsecure netwoks and non-https reqs to store cookies.
we need to withelist our domain(origin) for it.

📌 CORS + Credentials (Cookies) — Pointwise Notes
1️⃣ Install CORS in Backend

Using cors

Install package:
npm install cors
Purpose:
Automatically adds CORS headers in response
Avoids manual header handling
2️⃣ Add CORS Middleware in Backend
app.use(cors({
origin: "http://localhost:3000",
credentials: true
}));
🔹 origin
Defines which frontend is allowed
Sets header:
Access-Control-Allow-Origin: http://localhost:3000
❗ Must be specific (NOT \* when using credentials)
🔹 credentials: true
Allows:
Cookies 🍪
Authorization headers
Sets header:
Access-Control-Allow-Credentials: true
3️⃣ Frontend Setup (withCredentials)
Axios:
axios.get("http://localhost:5000/api", {
withCredentials: true
});
Meaning:
Browser will:
✅ Send cookies to backend
✅ Accept cookies from backend
4️⃣ 2-Way Requirement (VERY IMPORTANT)

Cookies work only if both sides agree

Frontend Backend
withCredentials: true credentials: true

👉 If one missing → ❌ cookies won’t work

5️⃣ Cookie Configuration (Backend)
res.cookie("token", value, {
httpOnly: true,
secure: true,
sameSite: "None"
});
Meaning:
httpOnly → JS cannot access cookie (security)
secure: true → only works on HTTPS
sameSite: "None" → allows cross-origin cookies
6️⃣ Axios / HTTPS Confusion
Axios does NOT block HTTP ❌
Browser enforces rules ✅
Real Rule:
If:
secure: true

👉 Then:

Cookie works only on HTTPS
May fail on localhost (HTTP)
7️⃣ Whitelisting Origin

✔️ Correct way:

origin: "http://localhost:3000"

❌ Wrong:

origin: "\*"
Why?
Cookies = sensitive data
Browser allows only trusted origins
8️⃣ Important Restriction (Interview Trap)

❌ This will NOT work:

origin: "\*",
credentials: true

👉 Browser blocks it

9️⃣ Full Flow
Step 1: Frontend request
axios.get("http://localhost:5000/api", {
withCredentials: true
});
Step 2: Backend CORS
app.use(cors({
origin: "http://localhost:3000",
credentials: true
}));
Step 3: Backend sends cookie
res.cookie("token", "abc123", {
httpOnly: true,
sameSite: "None",
secure: true
});
Step 4: Browser checks
Origin allowed ✅
Credentials allowed ✅

👉 Cookie stored + sent in future requests

🔟 Mental Model (REVISION GOLD)
CORS = permission system
origin = who can access
credentials = allow cookies
withCredentials = frontend requesting cookies
🧠 One-Line Summary

For cookies in CORS: backend must allow credentials + specific origin, and frontend must send withCredentials: true.

### Redux

// Redux - Alternative of prop drilling (prop drilling was a headache)
// Centralized store
// Terms -
// Action {event/object}(It's a [event] or [event+additional info], additional info like ex.- payload, object or data)
// Store {hold states} (It contains state,the data you want to manupulate, it also contains reducers)
// Reducer {functions}(This contains the entire logic for updating or changing a data)
// Slice {features}(The logics of maintaining states for every features is in 'Slice', this contains initial state and reducer function)
// State {data}

// Whole path -
// UI trigger -> Action dispatch -> store -> reducer -> state update in store -> UI update
// ex- button click -> handlefunc() -> store -> increment() -> num+1 in store -> num+1 in UI

// Steps -
// 1. create store (in 'redux' folder)
// 2. wrap the App.js with Provider
// 3. create slice (in 'features' folder)
// 4. create Reducers in slice
// 5. register the created reducers in the store

// useSelector, dispatch

What is Redux?

Redux is a state management library used to manage global state in applications.

👉 Instead of passing data through many components (prop drilling), Redux stores everything in one central place (store).

📌 Why Redux?
Avoid prop drilling
Share data across components
Predictable state management
Easier debugging
2️⃣ Core Concepts of Redux

Redux works using 3 main building blocks:

🏪 1. Store

👉 The single source of truth (global state)

{
counter: { value: 0 },
user: { name: "Krish" }
}
⚡ 2. Action

👉 A plain JavaScript object describing what happened

{ type: "counter/increment" }

With data:

{ type: "counter/incrementByAmount", payload: 5 }
🔧 3. Reducer

👉 A function that decides how state changes

(state, action) => newState
🔁 Redux Flow (VERY IMPORTANT)
UI → dispatch(action) → reducer → store updates → UI re-renders
3️⃣ Problems with Traditional Redux
Too much boilerplate
Separate files for actions, types, reducers
Complex setup
🚀 4️⃣ What is Redux Toolkit (RTK)?

Redux Toolkit is the official, modern way to write Redux

👉 It simplifies:

Store setup
Reducers
Actions
Async logic
5️⃣ Key Features of RTK
configureStore() → creates store
createSlice() → creates reducer + actions
createAsyncThunk() → handles API calls
Uses Immer internally
🔥 6️⃣ createSlice() (MOST IMPORTANT)
📌 Definition

A slice = part of state + reducers + actions

✅ Example: Counter Slice
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
name: "counter",

initialState: {
value: 0
},

reducers: {
increment: (state) => {
state.value += 1;
},

    decrement: (state) => {
      state.value -= 1;
    },

    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }

}
});
🧠 What createSlice RETURNS
{
reducer: function,
actions: {
increment,
decrement,
incrementByAmount
}
}
📦 Exporting
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
⚡ 7️⃣ Store Setup
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export const store = configureStore({
reducer: {
counter: counterReducer
}
});
🧠 State Shape
state = {
counter: { value: 0 }
}
🔗 8️⃣ Connecting Redux with React
import { Provider } from "react-redux";
import { store } from "./store";

<Provider store={store}>
  <App />
</Provider>
🎯 9️⃣ Using Redux in Components
📥 Read State → useSelector
import { useSelector } from "react-redux";

const count = useSelector((state) => state.counter.value);
📤 Update State → useDispatch
import { useDispatch } from "react-redux";
import { increment } from "./counterSlice";

const dispatch = useDispatch();

dispatch(increment());
🔄 10️⃣ Full Execution Flow (STEP-BY-STEP)
Step 1: Dispatch
dispatch(increment());
Step 2: Action Created
{ type: "counter/increment" }
Step 3: Reducer Executes
(state) => {
state.value += 1;
}
Step 4: State Updated
{
counter: { value: 1 }
}
Step 5: UI Re-renders
🧠 11️⃣ Important Concept: State Mutation
state.value += 1;

👉 Looks like mutation ❌
👉 Actually safe ✅ because of Immer

🌐 12️⃣ Async Operations → createAsyncThunk
📌 Example
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk(
"user/fetchUser",
async () => {
const res = await fetch("/api/user");
return res.json();
}
);
📌 Handling States
extraReducers: (builder) => {
builder
.addCase(fetchUser.pending, (state) => {
state.loading = true;
})
.addCase(fetchUser.fulfilled, (state, action) => {
state.loading = false;
state.data = action.payload;
})
.addCase(fetchUser.rejected, (state) => {
state.loading = false;
state.error = "Failed";
});
}
⚠️ 13️⃣ Common Mistakes

❌ Not understanding flow
✔️ Always remember:

dispatch → reducer → store → UI

❌ Trying to mutate state outside reducer
✔️ Only inside slice reducers

❌ Thinking Redux updates instantly
✔️ UI updates after render cycle

counterSlice.reduceer which is exported is imported as counnterReducer, both are same
🧠 Where is Redux “global state” actually stored?

👉 Short answer:

Redux state is NOT stored in the browser (by default).

It lives in:

✅ JavaScript memory (RAM) inside your running app

📦 Think of it like this:

When your React app runs:

Browser → loads JS → JS runs → Redux store created in memory

👉 That “global state” is just a JavaScript object in memory, like:

{
counter: { value: 5 },
user: { name: "Krish" }
}
⚡ Important: It is NOT stored in

❌ Local Storage
❌ Session Storage
❌ Cookies
❌ Database

👉 Unless YOU explicitly store it there

🔄 When does Redux state get LOST?

Since it lives in memory, it disappears when memory is cleared.

🧨 1. Page Refresh

👉 MOST COMMON

Ctrl + R / Reload

💥 Entire JS memory resets → Redux state gone

🧨 2. Closing Tab / Browser

👉 Same effect

💥 Memory cleared → state gone

🧨 3. App Crash / Re-render from scratch

If app reloads → state resets

⏳ Does Redux state “expire”?

👉 No built-in expiry system

Because:

It’s just memory
No persistence

👉 It exists ONLY while app is running

🧠 Realization (VERY IMPORTANT)

👉 Redux is temporary state management, not storage

💾 Then how do apps keep users logged in?

Good question 👇

They use:

1. Local Storage
   localStorage.setItem("user", JSON.stringify(user));
   Persistent
   Survives refresh
2. Cookies (for auth tokens)
   Used for authentication
   Sent to server automatically
3. Session Storage
   Cleared when tab closes
   🚀 4. Persisting Redux (REAL WORLD)

To keep Redux state after refresh, we use:

👉 redux-persist

Example Flow:
Redux state → saved to localStorage → reload → rehydrated back into store
Basic Example:
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
key: "root",
storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
🔥 Final Mental Model
Concept Reality
Redux store In-memory JS object
Lifetime Until page refresh
Persistence Only if you implement it
Default behavior Temporary
🧪 Real Example

Login flow WITHOUT persistence:

Login → Redux stores user → Refresh → user gone ❌

WITH persistence:

Login → saved in localStorage → Refresh → restored ✅
⚠️ Common Beginner Mistake

❌ “Redux will remember my data automatically”
✔️ It will NOT — unless you persist it

🏁 Final Answer (1 line)

👉 Redux global state is stored in JavaScript memory (RAM) and is lost on refresh, tab close, or app reload, unless you persist it using tools like redux-persist.
npm install @reduxjs/toolkit react-redux

using redux devtools extension for checking all actions,states,differences,etc
useSelector is used to subscribe to the redux store and useDispatch hook is used to dispatch an action for a slice

### Redux store loss

when we login, the user is stored in redux and the user id is stored in cookies as jwt token, when we refresh the redux state/data is lost but token remains.
so using get /pprofile we can get back the user and using useDispatch(addUser()) we can again add user along with useEffect hook.
