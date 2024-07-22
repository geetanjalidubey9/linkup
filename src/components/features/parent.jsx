import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FriendsList from './friend';
import ChatArea from '../Chats/ChatArea';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/chat/:chatId" element={<ChatArea />} />
      </Routes>
    </Router>
  );
}

export default App;
