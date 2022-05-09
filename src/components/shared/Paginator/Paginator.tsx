import styles from './styles.module.scss';

import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

const Paginator: React.FC<ReactPaginateProps> = (props) => {
  return (
    <ReactPaginate
      {...props}
      className={styles.paginator}
      disabledClassName={styles.disabled}
      pageRangeDisplayed={5}
      breakLabel="..."
    />
  );
};

export { Paginator };
