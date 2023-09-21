import React from 'react';

const MyIframe = ({ src, title }) => {
    return (
        <div className="iframe-container">
            <iframe
                src={src}
                title={title}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
            ></iframe>
            <style jsx>{`
        .iframe-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100vh;
        }
        .iframe-container > iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>
        </div>
    );
};

export default MyIframe;
