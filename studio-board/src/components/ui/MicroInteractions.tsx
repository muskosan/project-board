import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { transitions } from '../../utils/animations';

// Hover lift effect for interactive elements
interface HoverLiftProps {
  children: React.ReactNode;
  lift?: number;
  scale?: number;
  className?: string;
}

export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  lift = 4,
  scale = 1.02,
  className,
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -lift,
        scale,
        transition: transitions.micro,
      }}
      whileTap={{
        y: -lift / 2,
        scale: scale * 0.98,
        transition: transitions.micro,
      }}
    >
      {children}
    </motion.div>
  );
};

// Pulse effect for attention-grabbing elements
interface PulseProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  scale = 1.05,
  duration = 2,
  className,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// Bounce effect for success states
interface BounceProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export const Bounce: React.FC<BounceProps> = ({
  children,
  trigger = false,
  className,
}) => {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// Shake effect for error states
interface ShakeProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export const Shake: React.FC<ShakeProps> = ({
  children,
  trigger = false,
  className,
}) => {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        x: [0, -10, 10, -10, 10, 0],
      } : {}}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating animation for decorative elements
interface FloatProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  className?: string;
}

export const Float: React.FC<FloatProps> = ({
  children,
  distance = 10,
  duration = 3,
  className,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// Ripple effect for button clicks
const RippleContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const RippleEffect = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
`;

interface RippleProps {
  children: React.ReactNode;
  className?: string;
}

export const Ripple: React.FC<RippleProps> = ({ children, className }) => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <RippleContainer className={className} onClick={handleClick}>
      {children}
      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          initial={{
            width: 0,
            height: 0,
            x: ripple.x,
            y: ripple.y,
            opacity: 1,
          }}
          animate={{
            width: 200,
            height: 200,
            x: ripple.x - 100,
            y: ripple.y - 100,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </RippleContainer>
  );
};

// Magnetic effect for interactive elements
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.3,
  className,
}) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) * strength;
    const deltaY = (event.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

// Tilt effect for cards
interface TiltProps {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}

export const Tilt: React.FC<TiltProps> = ({
  children,
  maxTilt = 15,
  className,
}) => {
  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0 });
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((event.clientX - centerX) / (rect.width / 2)) * maxTilt;
    const rotateX = ((centerY - event.clientY) / (rect.height / 2)) * maxTilt;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};