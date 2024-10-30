import { Box, Flex, IconButton } from '@invoke-ai/ui-library';
import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { BeginEndStepPct } from 'features/controlLayers/components/common/BeginEndStepPct';
import { CanvasEntitySettingsWrapper } from 'features/controlLayers/components/common/CanvasEntitySettingsWrapper';
import { Weight } from 'features/controlLayers/components/common/Weight';
import { IPAdapterMethod } from 'features/controlLayers/components/IPAdapter/IPAdapterMethod';
import { useEntityIdentifierContext } from 'features/controlLayers/contexts/EntityIdentifierContext';
import { usePullBboxIntoGlobalReferenceImage } from 'features/controlLayers/hooks/saveCanvasHooks';
import { useCanvasIsBusy } from 'features/controlLayers/hooks/useCanvasIsBusy';
import {
  referenceImageIPAdapterBeginEndStepPctChanged,
  referenceImageIPAdapterCLIPVisionModelChanged,
  referenceImageIPAdapterImageChanged,
  referenceImageIPAdapterMethodChanged,
  referenceImageIPAdapterModelChanged,
  referenceImageIPAdapterWeightChanged,
} from 'features/controlLayers/store/canvasSlice';
import { selectIsFLUX } from 'features/controlLayers/store/paramsSlice';
import { selectCanvasSlice, selectEntityOrThrow } from 'features/controlLayers/store/selectors';
import type { CLIPVisionModelV2, IPMethodV2 } from 'features/controlLayers/store/types';
import { Dnd } from 'features/dnd/dnd';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PiBoundingBoxBold } from 'react-icons/pi';
import type { ImageDTO, IPAdapterModelConfig, IPALayerImagePostUploadAction } from 'services/api/types';

import { IPAdapterImagePreview } from './IPAdapterImagePreview';
import { IPAdapterModel } from './IPAdapterModel';

export const IPAdapterSettings = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const entityIdentifier = useEntityIdentifierContext('reference_image');
  const selectIPAdapter = useMemo(
    () => createSelector(selectCanvasSlice, (s) => selectEntityOrThrow(s, entityIdentifier).ipAdapter),
    [entityIdentifier]
  );
  const ipAdapter = useAppSelector(selectIPAdapter);

  const onChangeBeginEndStepPct = useCallback(
    (beginEndStepPct: [number, number]) => {
      dispatch(referenceImageIPAdapterBeginEndStepPctChanged({ entityIdentifier, beginEndStepPct }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeWeight = useCallback(
    (weight: number) => {
      dispatch(referenceImageIPAdapterWeightChanged({ entityIdentifier, weight }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeIPMethod = useCallback(
    (method: IPMethodV2) => {
      dispatch(referenceImageIPAdapterMethodChanged({ entityIdentifier, method }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeModel = useCallback(
    (modelConfig: IPAdapterModelConfig) => {
      dispatch(referenceImageIPAdapterModelChanged({ entityIdentifier, modelConfig }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeCLIPVisionModel = useCallback(
    (clipVisionModel: CLIPVisionModelV2) => {
      dispatch(referenceImageIPAdapterCLIPVisionModelChanged({ entityIdentifier, clipVisionModel }));
    },
    [dispatch, entityIdentifier]
  );

  const onChangeImage = useCallback(
    (imageDTO: ImageDTO | null) => {
      dispatch(referenceImageIPAdapterImageChanged({ entityIdentifier, imageDTO }));
    },
    [dispatch, entityIdentifier]
  );

  const postUploadAction = useMemo<IPALayerImagePostUploadAction>(
    () => ({ type: 'SET_IPA_IMAGE', id: entityIdentifier.id }),
    [entityIdentifier.id]
  );
  const targetData = useMemo<Dnd.types['TargetDataTypeMap']['setGlobalReferenceImage']>(
    () => Dnd.Target.setGlobalReferenceImage.getData({ entityIdentifier }, ipAdapter.image?.image_name),
    [entityIdentifier, ipAdapter.image?.image_name]
  );
  const pullBboxIntoIPAdapter = usePullBboxIntoGlobalReferenceImage(entityIdentifier);
  const isBusy = useCanvasIsBusy();

  const isFLUX = useAppSelector(selectIsFLUX);

  return (
    <CanvasEntitySettingsWrapper>
      <Flex flexDir="column" gap={2} position="relative" w="full">
        <Flex gap={2} alignItems="center" w="full">
          <Box minW={0} w="full" transitionProperty="common" transitionDuration="0.1s">
            <IPAdapterModel
              modelKey={ipAdapter.model?.key ?? null}
              onChangeModel={onChangeModel}
              clipVisionModel={ipAdapter.clipVisionModel}
              onChangeCLIPVisionModel={onChangeCLIPVisionModel}
            />
          </Box>
          <IconButton
            onClick={pullBboxIntoIPAdapter}
            isDisabled={isBusy}
            variant="ghost"
            aria-label={t('controlLayers.pullBboxIntoReferenceImage')}
            tooltip={t('controlLayers.pullBboxIntoReferenceImage')}
            icon={<PiBoundingBoxBold />}
          />
        </Flex>
        <Flex gap={2} w="full" alignItems="center">
          <Flex flexDir="column" gap={2} w="full">
            {!isFLUX && <IPAdapterMethod method={ipAdapter.method} onChange={onChangeIPMethod} />}
            <Weight weight={ipAdapter.weight} onChange={onChangeWeight} />
            <BeginEndStepPct beginEndStepPct={ipAdapter.beginEndStepPct} onChange={onChangeBeginEndStepPct} />
          </Flex>
          <Flex alignItems="center" justifyContent="center" h={32} w={32} aspectRatio="1/1">
            <IPAdapterImagePreview
              image={ipAdapter.image}
              onChangeImage={onChangeImage}
              targetData={targetData}
              postUploadAction={postUploadAction}
            />
          </Flex>
        </Flex>
      </Flex>
    </CanvasEntitySettingsWrapper>
  );
});

IPAdapterSettings.displayName = 'IPAdapterSettings';
