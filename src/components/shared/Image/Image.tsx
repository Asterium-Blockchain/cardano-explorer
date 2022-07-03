import { useState } from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { Box, Icon, Skeleton } from '@chakra-ui/react';
import { CameraOff } from 'react-feather';
import useImageLoaded from '@/hooks/useImageLoaded';

interface ImageProps {
  src?: string | null;
  alt?: string;
  width: number;
  height: number;
}

const Image: React.FC<ImageProps> = ({ src, alt, width, height }) => {
  const [ref, loaded, onLoad] = useImageLoaded();
  const [isError, setIsError] = useState(false);

  const toggleError = () => {
    setIsError(true);
  };

  return (
    <Box
      className={styles.imageWrapper}
      style={{ width, height }}
      display={'flex'}
      alignItems="center"
      border={isError ? '1px' : undefined}
      borderColor="gray.700"
      borderRadius={'md'}
    >
      {!loaded && (
        <Skeleton
          style={{ width, height }}
          className={styles.imagePlaceholder}
        />
      )}
      {isError && <Icon as={CameraOff} m="auto" color={'gray.600'} />}
      <img
        src={src || ''}
        width={width}
        height={height}
        alt={alt}
        ref={ref}
        onLoad={onLoad}
        className={classnames(styles.image, {
          [styles.isLoading]: !loaded,
          [styles.isError]: isError,
        })}
        onError={toggleError}
      />
    </Box>
  );
};

export { Image };
