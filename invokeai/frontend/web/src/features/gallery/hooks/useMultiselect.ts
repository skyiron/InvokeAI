import { createSelector } from '@reduxjs/toolkit';
import { galleryImageClicked } from 'app/store/middleware/listenerMiddleware/listeners/galleryImageClicked';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { selectHasMultipleImagesSelected } from 'features/gallery/store/gallerySelectors';
import { selectGallerySlice, selectionChanged } from 'features/gallery/store/gallerySlice';
import { useFeatureStatus } from 'features/system/hooks/useFeatureStatus';
import type { MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';
import type { ImageDTO } from 'services/api/types';

export const useMultiselect = (imageDTO: ImageDTO) => {
  const dispatch = useAppDispatch();
  const areMultiplesSelected = useAppSelector(selectHasMultipleImagesSelected);
  const selectIsSelected = useMemo(
    () =>
      createSelector(selectGallerySlice, (gallery) =>
        gallery.selection.some((i) => i.image_name === imageDTO.image_name)
      ),
    [imageDTO.image_name]
  );
  const isSelected = useAppSelector(selectIsSelected);
  const isMultiSelectEnabled = useFeatureStatus('multiselect');

  const onClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isMultiSelectEnabled) {
        dispatch(selectionChanged([imageDTO]));
        return;
      }

      dispatch(
        galleryImageClicked({
          imageDTO,
          shiftKey: e.shiftKey,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          altKey: e.altKey,
        })
      );
    },
    [dispatch, imageDTO, isMultiSelectEnabled]
  );

  return {
    areMultiplesSelected,
    isSelected,
    onClick,
  };
};
