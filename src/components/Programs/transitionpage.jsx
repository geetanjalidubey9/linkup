import React from 'react';
import './transitionpage.css'; // Import your CSS file for styling
import profileImage1 from '../../assets/build-communication.png';
import profileImage2 from '../../assets/aboutpage2.png';
// import profileImage3 from '../../assets/chats1.jpg';

const TransitionPage = () => {
  return (
    <div className='transition-page'>
      <div className="page" id='page1'>
        <img className="vert-move" id="image1" src={profileImage1} alt="Placeholder" />
        <div className='text'>
          <h1>Page 1</h1>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta dolores possimus natus, vero, ab vel commodi ut ducimus architecto at distinctio suscipit laboriosam ex accusamus reprehenderit praesentium molestias consequatur sint officia, cum earum aut.
        </div>
      </div>
      <div className="page" id='page2'>
      <div className='text' >
          <h1>Page 2</h1>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta dolores possimus natus, vero, ab vel commodi ut ducimus architecto at distinctio suscipit laboriosam ex accusamus reprehenderit praesentium molestias consequatur sint officia, cum earum aut.
        </div>
        <img className="vert-move" id="image2" src={profileImage2} alt="Placeholder" />
        
      </div>
      
     
    </div>
  );
};

export default TransitionPage;
