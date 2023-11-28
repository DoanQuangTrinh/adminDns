import { HStack, Button } from "@chakra-ui/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <HStack>
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={isFirstPage}
      >
        Previous
      </Button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <Button
          key={i}
          onClick={() => handlePageChange(i + 1)}
          variant={currentPage === i + 1 ? "solid" : "ghost"}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={isLastPage}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;