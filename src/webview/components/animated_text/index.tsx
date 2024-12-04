import React from 'react';
import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useUtility } from '../../../providers/utility-provider';

// Animated Text Component
const AnimatedText = () => {
  const text = 'TestGenie';
  const { setAnimStatus } = useUtility();

  // Generate an array of springs for each letter of the text
  const springs = text.split('').map((_, index) => {
    return useSpring({
      opacity: 1,
      from: { opacity: 0 },
      delay: index * 200, // Each letter appears with a delay
      onRest: index === text.length - 1 ? () => setAnimStatus(false) : undefined, // Set status after the last animation completes
    });
  });

  return (
    <div style={{ display: 'flex', fontSize: '40px', fontWeight: 'bold', fontFamily: 'Arial' }}>
      {text.split('').map((letter, index) => (
        <animated.span key={index} style={springs[index]}>
          {letter}
        </animated.span>
      ))}
    </div>
  );
};

export default AnimatedText;
