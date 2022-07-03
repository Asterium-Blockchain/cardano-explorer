import {
  Pagination,
  PaginationContainer,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationPage,
  PaginationNext,
} from '@ajna/pagination';
import { Icon } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'react-feather';

interface PaginatorProps {
  currentPage: number;
  pagesCount: number;
  setCurrentPage: (curr: number) => void;
  pages: number[];
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  pagesCount,
  setCurrentPage,
  pages,
}) => {
  return (
    <Pagination
      currentPage={currentPage}
      pagesCount={pagesCount}
      onPageChange={setCurrentPage}
      isDisabled={false}
    >
      <PaginationContainer>
        <PaginationPrevious mr="3">
          <Icon as={ChevronLeft} />
        </PaginationPrevious>
        <PaginationPageGroup>
          {pages.map((page) => (
            <PaginationPage
              key={`p_${page}`}
              page={page}
              isActive={currentPage === page}
              px="3"
            />
          ))}
        </PaginationPageGroup>
        <PaginationNext ml="3">
          <Icon as={ChevronRight} />
        </PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
};

export { Paginator };
