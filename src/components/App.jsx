import { useEffect, useState } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { Button } from './Button';
import { ImageGallery } from './ImageGallery';
import { Loader } from './Loader';
import { Searchbar } from './Searchbar';
import { getImg } from 'fetch/axios';
import { ContainerStyled } from './App.styled';
import { ButtonUp } from './ButtonUp';
import { Notify } from 'notiflix';

export const App = () => {
  const [img, setImg] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchValue) return;
    setIsLoading(true);
    getImg(searchValue, page)
      .then(({ totalHits, hits }) => {
        if (totalHits < 1) {
          throw new Error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        if (page !== 1) smoothScroll(getNextPageHeight());
        setTotalPage(Math.ceil(totalHits / 12));
        setImg(prevImg => (page === 1 ? hits : [...prevImg, ...hits]));
        if (page === 1) Notify.success(`Hooray! We found ${totalHits} images.`);
      })
      .catch(({ message }) => Notify.failure(message))
      .finally(() => setIsLoading(false));
  }, [searchValue, page]);

  function onChangePage() {
    setPage(prevPage => prevPage + 1);
  }

  function getNextPageHeight() {
    const { height: cardHeight } = document
      .querySelector('.galleryWrapp')
      .firstElementChild.getBoundingClientRect();
    return cardHeight;
  }

  function smoothScroll(cardHeight) {
    scroll.scrollMore(cardHeight * 2);
  }

  function onSubmit(value) {
    setImg([]);
    setSearchValue(value);
    setPage(1);
    setTotalPage(0);
  }

  return (
    <ContainerStyled>
      <Searchbar onSubmit={onSubmit} currentPage={{ page, totalPage }} />
      <ImageGallery img={img} />
      {isLoading && <Loader />}
      {totalPage > 1 && page < totalPage && <Button onClick={onChangePage} />}
      <ButtonUp />
    </ContainerStyled>
  );
};