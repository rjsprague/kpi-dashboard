import React from 'react';

const MyIframe = ({ src, title }) => {
    return (
        <div className="iframe-container">
            <iframe
                src={src}
                title={title}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            ></iframe>
            <style jsx>{`
        .iframe-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 93vh;
        }
        .iframe-container > iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 90%;
          border: 0;
        }
      `}</style>
        </div>
    );
};

export default MyIframe;
