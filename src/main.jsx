// import React, { Suspense, useState } from "react"; // Make sure Suspense is imported
// import "./main.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { createRoot } from "react-dom/client";

// import App from "./App";
// import "./index.css";

// // Import lazy-loaded components

// const Friends=React.lazy(() => import("./components/features/friend.jsx"));
// const Setting = React.lazy(() => import("./components/features/settings.jsx"));
// const Home = React.lazy(() => import("./components/Home/home.jsx"));
// const Navbar1 = React.lazy(() => import("./components/Navbar/Navbar1.jsx"));
// const Hero = React.lazy(() => import("./components/Hero/Hero.jsx"));
// const Navbar2 = React.lazy(() => import("./components/Navbar/Navbar2.jsx"));
// const Login = React.lazy(() => import("./components/register/login.jsx"));
// const Signup = React.lazy(() => import("./components/register/signup.jsx"));
// const Chatleftbar = React.lazy(() =>
//   import("./components/Chats/Chatleftbar.jsx")
// );
// const SingleChat = React.lazy(() =>
//   import("./components/Chats/SingleChat.jsx")
// );
// const ChatArea = React.lazy(() =>
//   import("./components/Chats/ChatArea.jsx")
// );
// const ForgotPasswordPage = React.lazy(() =>
//   import("./components/register/forgott-password.jsx")
// );
// const ResetPasswordPage = React.lazy(() =>
//   import("./components/register/reset-password.jsx")
// );
// const OTPVerificationPage = React.lazy(() =>
//   import("./components/register/otp-verification.jsx")
// );
// const Messageleftbar = React.lazy(() =>
//   import("./components/Messages/Messageleftbar.jsx")
// );
// const ProjectSection = React.lazy(() =>
//   import("./components/Projects/Project.jsx")
// );
// const ProjectDetails = React.lazy(() =>
//   import("./components/Projects/details.jsx")
// );
// const Transitionpage = React.lazy(() =>
//   import("./components/Programs/transitionpage.jsx")
// );
// const Contact = React.lazy(() => import("./components/Programs/contact.jsx"));
// const Status = React.lazy(() => import("./components/Programs/status.jsx"));
// const Notification = React.lazy(() =>
//   import("./components/Notification/Notification.jsx")
// );
// const Request= React.lazy(() =>
//   import("./components/Notification/request.jsx")
// );
// const Msgnot= React.lazy(() =>
//   import("./components/Notification/msgnot.jsx")
// );
// const Profile = React.lazy(() =>
//   import("./components/Programs/profilepage.jsx")
// );
// const Footer = React.lazy(() => import("./components/footer/footer.jsx"));
// const About = React.lazy(() => import("./components/Programs/about.jsx"));
// const ProjectForm = React.lazy(() =>
//   import("./components/Projects/ProjectForm.jsx")
// );

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Router>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <>
//                 <Navbar1 />
//                 <Hero />
//                 <About />
//                 <Transitionpage />
//                 <Footer />
//               </>
//             }
//           />
//           <Route
//             path="/home"
//             element={
//               <>
//                 <Navbar2 />
//                 <Chatleftbar />
//                 <Home />
//               </>
//             }
//           />

//          <Route
//             path="/chat/:chatId"
//             element={
//               <>
//                 <Navbar2 />
//                 <Messageleftbar/>
//                 <ChatArea />

//               </>
//             }
//          />
//          <Route
//             path="/messages/:userName"
//             element={
//               <>

//                 <SingleChat/>

//               </>
//             }
//          />
//           <Route
//             path="/login"
//             element={
//               <>
//                 <Navbar1 />
//                 <Login />
//               </>
//             }
//           />
//           <Route
//             path="/signup"
//             element={
//               <>
//                 <Navbar1 />
//                 <Signup />
//               </>
//             }
//           />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route
//             path="/reset-password/:token"
//             element={<ResetPasswordPage />}
//           />
//           <Route path="/verification" element={<OTPVerificationPage />} />

//           <Route
//             path="/Projects"
//             element={
//               <>
//                 <Navbar2 />
//                 <ProjectSection />
//               </>
//             }
//           />
//           <Route
//             path="/contact-us"
//             element={
//               <>
//                 <Navbar1 />
//                 <Contact />
//               </>
//             }
//           />
//           <Route
//             path="/about-us"
//             element={
//               <>
//                 <h1>About Us</h1>
//                 <Navbar1 />
//                 <About />
//                 <Transitionpage />
//               </>
//             }
//           />

// <Route
//             path="/ChatArea"
//             element={
//               <>

//                 <ChatArea />
//               </>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <>
//                 <Navbar1 />
//                 <Profile />
//               </>
//             }
//           />
//            <Route path="/settings" element={
//             <>
//            <Navbar2/>
//            <Setting/>
//            </>
//            } />

//            <Route path="/status" element={<Status/>} />
//            <Route path="/friends" element={<Friends/>} />
//           <Route path="/Notification" element={<Notification />} />
//           <Route path="/request" element={<Request />} />
//           <Route path="/MessageNotification" element={<Msgnot />} />
//           <Route path="/projects/create-project" element={<ProjectForm />} />
//           <Route path="/projects/:id" element={<ProjectDetails />} />
//         </Routes>
//       </Suspense>
//       <App />
//     </Router>
//   </React.StrictMode>
// // );

// import React, { Suspense } from "react";
// import "./main.css";
// import { SocketProvider } from "./connection.jsx";

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import "./index.css";

// // Import lazy-loaded components
// const Friends = React.lazy(() => import("./components/features/friend.jsx"));
// const Setting = React.lazy(() => import("./components/features/settings.jsx"));
// const Home = React.lazy(() => import("./components/Home/home.jsx"));
// const Navbar1 = React.lazy(() => import("./components/Navbar/Navbar1.jsx"));
// const Hero = React.lazy(() => import("./components/Hero/Hero.jsx"));
// const Navbar2 = React.lazy(() => import("./components/Navbar/Navbar2.jsx"));
// const Login = React.lazy(() => import("./components/register/login.jsx"));
// const Signup = React.lazy(() => import("./components/register/signup.jsx"));
// const Chatleftbar = React.lazy(() =>
//   import("./components/Chats/Chatleftbar.jsx")
// );

// const Chatlist = React.lazy(() => import("./components/Chats/Chatlist.jsx"));
// const ChatArea = React.lazy(() => import("./components/Chats/ChatArea.jsx"));
// const ForgotPasswordPage = React.lazy(() =>
//   import("./components/register/forgott-password.jsx")
// );
// const ResetPasswordPage = React.lazy(() =>
//   import("./components/register/reset-password.jsx")
// );
// const OTPVerificationPage = React.lazy(() =>
//   import("./components/register/otp-verification.jsx")
// );

// const ProjectSection = React.lazy(() =>
//   import("./components/Projects/Project.jsx")
// );
// const ProjectDetails = React.lazy(() =>
//   import("./components/Projects/details.jsx")
// );
// const Transitionpage = React.lazy(() =>
//   import("./components/Programs/transitionpage.jsx")
// );
// const Contact = React.lazy(() => import("./components/Programs/contact.jsx"));

// const Notification = React.lazy(() =>
//   import("./components/Notification/Notification.jsx")
// );

// const Profile = React.lazy(() =>
//   import("./components/Programs/profilepage.jsx")
// );
// const Footer = React.lazy(() => import("./components/footer/footer.jsx"));
// const About = React.lazy(() => import("./components/Programs/about.jsx"));
// const ProjectForm = React.lazy(() =>
//   import("./components/Projects/ProjectForm.jsx")
// );

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <SocketProvider>
//       <Router>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <>
//                   <Navbar1 />
//                   <Hero />
//                   <About />
//                   <Transitionpage />
//                   <Contact />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/home"
//               element={
//                 <>
//                   <Navbar2 />
//                   <Chatleftbar />
//                 </>
//               }
//             />
//             <Route
//               path="/home/search-group"
//               element={
//                 <>
//                   <Navbar2 />
//                   <Chatleftbar />
//                   <Home />
//                 </>
//               }
//             />

//             <Route
//               path="/chat"
//               element={
//                 <>
//                   <Navbar2 />

//                   <Chatlist />
//                   {/* <ChatArea /> */}
//                 </>
//               }
//             />
//             <Route
//               path="/chat/:conversationId"
//               element={
//                 <>
//                   <Navbar2 />

//                   <Chatlist />
//                   <ChatArea />
//                 </>
//               }
//             />
//             <Route
//               path="/chat/:conversationId"
//               element={
//                 <>
//                   <Navbar2 />

//                   <Chatlist />
//                   <ChatArea />
//                 </>
//               }
//             />
//             <Route
//               path="/Chats"
//               element={
//                 <>
//                   <Navbar2 />
//                 </>
//               }
//             />
//             <Route
//               path="/chtlist"
//               element={
//                 <>
//                   <Chatlist />
//                 </>
//               }
//             />
//             <Route
//               path="/login"
//               element={
//                 <>
//                   <Navbar1 />
//                   <Login />
//                 </>
//               }
//             />
//             <Route
//               path="/signup"
//               element={
//                 <>
//                   <Navbar1 />
//                   <Signup />
//                 </>
//               }
//             />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//             <Route
//               path="/reset-password/:resetToken"
//               element={<ResetPasswordPage />}
//             />
//             <Route path="/verification" element={<OTPVerificationPage />} />
//             <Route
//               path="/Projects"
//               element={
//                 <>
//                   <Navbar2 />
//                   <ProjectSection />
//                 </>
//               }
//             />
//             <Route
//               path="/contact-us"
//               element={
//                 <>
//                   <Navbar1 />
//                   <Contact />
//                 </>
//               }
//             />
//             <Route
//               path="/about-us"
//               element={<> 
//               <h1>About Us</h1>
//                   <Navbar1 />
//                   <About />
//                   <Transitionpage />
//                 </>
//               }
//             />

//             <Route
//               path="/profile"
//               element={<>
//                   <Navbar1 />
//                   <Profile />
//                 </>
//               }
//             />
//             <Route
//               path="/home/settings"
//               element={<>
//                   <Navbar2 />
//                   <Setting />
//                 </>
//               }
//             />
        

//             <Route

//               path="/home/friends"
//               element={<><Navbar2 />
//                   <Friends />
//                 </>
//               }
//             />
//             <Route
//               path="/Notification"element={<>
//                   <Notification />
//                   <Navbar2 />
//                 </>
//               }/>
//             <Route path="/projects/create-project" element={<ProjectForm />} />
//             <Route path="/projects/:id" element={<ProjectDetails />} />
//           </Routes>
//         </Suspense>
//         <App />
//       </Router>
//     </SocketProvider>
//   </React.StrictMode>
// );
import React, { Suspense } from "react";
import "./main.css";
import { SocketProvider } from "./connection.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import lazy-loaded components
const Friends = React.lazy(() => import("./components/features/friend.jsx"));
const Setting = React.lazy(() => import("./components/features/settings.jsx"));
const Home = React.lazy(() => import("./components/Home/home.jsx"));
const Navbar1 = React.lazy(() => import("./components/Navbar/Navbar1.jsx"));
const Hero = React.lazy(() => import("./components/Hero/Hero.jsx"));
const Navbar2 = React.lazy(() => import("./components/Navbar/Navbar2.jsx"));
const Login = React.lazy(() => import("./components/register/login.jsx"));
const Signup = React.lazy(() => import("./components/register/signup.jsx"));
const Chatleftbar = React.lazy(() => import("./components/Chats/Chatleftbar.jsx"));
const Chatlist = React.lazy(() => import("./components/Chats/Chatlist.jsx"));
const ChatArea = React.lazy(() => import("./components/Chats/ChatArea.jsx"));
const ForgotPasswordPage = React.lazy(() => import("./components/register/forgott-password.jsx"));
const ResetPasswordPage = React.lazy(() => import("./components/register/reset-password.jsx"));
const OTPVerificationPage = React.lazy(() => import("./components/register/otp-verification.jsx"));
const ProjectSection = React.lazy(() => import("./components/Projects/Project.jsx"));
const ProjectDetails = React.lazy(() => import("./components/Projects/details.jsx"));
const Transitionpage = React.lazy(() => import("./components/Programs/transitionpage.jsx"));
const Contact = React.lazy(() => import("./components/Programs/contact.jsx"));
const Notification = React.lazy(() => import("./components/Notification/Notification.jsx"));
const Profile = React.lazy(() => import("./components/Programs/profilepage.jsx"));
const Footer = React.lazy(() => import("./components/footer/footer.jsx"));
const About = React.lazy(() => import("./components/Programs/about.jsx"));
const ProjectForm = React.lazy(() => import("./components/Projects/ProjectForm.jsx"));

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<><Navbar1 /><Hero /><About /><Transitionpage /><Contact /><Footer /></>} />
            <Route path="/home" element={<><Navbar2 /><Chatleftbar /></>} />
            <Route path="/home/search-group" element={<><Navbar2 /><Chatleftbar /><Home /></>} />
            <Route path="/chat" element={<><Navbar2 /><Chatlist /></>} />
            <Route path="/chat/:conversationId" element={<><Navbar2 /><Chatlist /><ChatArea /></>} />
            <Route path="/login" element={<><Navbar1 /><Login /></>} />
            <Route path="/signup" element={<><Navbar1 /><Signup /></>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
            <Route path="/verification" element={<OTPVerificationPage />} />
            <Route path="/projects" element={<><Navbar2 /><ProjectSection /></>} />
            <Route path="/contact-us" element={<><Navbar1 /><Contact /></>} />
            <Route path="/about-us" element={<><Navbar1 /><About /><Transitionpage /></>} />
            <Route path="/profile" element={<><Navbar1 /><Profile /></>} />
            <Route path="/home/settings" element={<><Navbar2 /><Setting /></>} />
            <Route path="/home/friends" element={<><Navbar2 /><Friends /></>} />
            <Route path="/notification" element={<><Navbar2 /><Notification /></>} />
            <Route path="/projects/create-project" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Suspense>
        <App />
      </Router>
    </SocketProvider>
  </React.StrictMode>
);

