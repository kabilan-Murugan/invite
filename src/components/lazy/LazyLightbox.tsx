import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface LazyLightboxProps {
  open: boolean;
  close: () => void;
  index: number;
  slides: Array<{ src: string; title?: string; description?: string }>;
}

const LazyLightbox: React.FC<LazyLightboxProps> = ({ open, close, index, slides }) => {
  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={slides}
      animation={{ fade: 300, swipe: 400 }}
      carousel={{ finite: false }}
    />
  );
};

export default LazyLightbox;

