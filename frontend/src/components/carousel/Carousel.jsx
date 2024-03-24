/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@mui/material';
import { BlueButton, RedButton } from '../ButtonStyled';

import classes from './Carousel.module.scss';

const Carousel = ({ images, interval = 5000 }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const handleNext = () => {
    setDirection('right');
    setIndex((index + 1) % images.length);
  }

  const handlePrev = () => {
    setDirection('left');
    setIndex((index - 1 + images.length) % images.length);
  }

  const handleDotClick = (i) => {
    setIndex(i);
  };

  // Making the images slide automatically
  useEffect(() => {
    const intervalId = setInterval(handleNext, interval);
    return () => clearInterval(intervalId);
  }, [index]);

  return (
    <div className={classes.carousel_head}>
      <div className={classes.carousel}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            className={classes.imageContainer}
            initial={{ x: direction === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: direction === 'right' ? '-100%' : '100%', transition: { duration: 0 } }}
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 } }}
          >
            <img src={images[index].src} alt={`Image ${index}`} className={classes.image} />
            <div className={classes.overlay}>
            	<h2 className={classes.overlay_title}>{images[index].title}</h2>
              <p className={classes.overlay_des}>{images[index].description}</p>
              <div className={classes.buttons}>
                <BlueButton className={classes.overlay_button}>{images[index].button}</BlueButton>
                <RedButton className={classes.overlay_button2}>{images[index].button2}</RedButton>
              </div>

              <div className={classes.controls}>
                <div onClick={handlePrev} className={classes.control_prev}>&#10094;</div>
                <div onClick={handleNext} className={classes.control_next}>&#10095;</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* <div className={classes.controls}>
          <div onClick={handlePrev} className={classes.control_prev}>&#10094;</div>
          <div onClick={handleNext} className={classes.control_next}>&#10095;</div>
        </div> */}
      </div>
      <div className={classes.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => handleDotClick(i)}
            className={i === index ? classes.dot_active : classes.dot}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel;
