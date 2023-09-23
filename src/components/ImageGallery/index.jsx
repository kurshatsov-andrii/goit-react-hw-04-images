import { ImageGalleryItem } from 'components/ImageGalleryItem';
import { ImageGalleryStyled } from './ImageGallery.styled';

export function ImageGallery({ img }) {
  console.log(img)
  
    return (
        <ImageGalleryStyled className="galleryWrapp">
          {img &&
            img.map(item => (
              <ImageGalleryItem
                key={item.id}
                itemImg={item}
              />
            ))}
        </ImageGalleryStyled>
    );
  }