import { Spacer } from '@invoke-ai/ui-library';
import { CanvasEntityContainer } from 'features/controlLayers/components/CanvasEntityList/CanvasEntityContainer';
import { CanvasEntityHeader } from 'features/controlLayers/components/common/CanvasEntityHeader';
import { CanvasEntityHeaderCommonActions } from 'features/controlLayers/components/common/CanvasEntityHeaderCommonActions';
import { CanvasEntityPreviewImage } from 'features/controlLayers/components/common/CanvasEntityPreviewImage';
import { CanvasEntitySettingsWrapper } from 'features/controlLayers/components/common/CanvasEntitySettingsWrapper';
import { CanvasEntityEditableTitle } from 'features/controlLayers/components/common/CanvasEntityTitleEdit';
import { ControlLayerBadges } from 'features/controlLayers/components/ControlLayer/ControlLayerBadges';
import { ControlLayerControlAdapter } from 'features/controlLayers/components/ControlLayer/ControlLayerControlAdapter';
import { ControlLayerAdapterGate } from 'features/controlLayers/contexts/EntityAdapterContext';
import { EntityIdentifierContext } from 'features/controlLayers/contexts/EntityIdentifierContext';
import type { CanvasEntityIdentifier } from 'features/controlLayers/store/types';
import { Dnd } from 'features/dnd/dnd';
import { DndDropTarget } from 'features/dnd/DndDropTarget';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  id: string;
};

export const ControlLayer = memo(({ id }: Props) => {
  const { t } = useTranslation();
  const entityIdentifier = useMemo<CanvasEntityIdentifier<'control_layer'>>(
    () => ({ id, type: 'control_layer' }),
    [id]
  );
  const targetData = useMemo<Dnd.types['TargetDataTypeMap']['replaceLayerWithImage']>(
    () => Dnd.Target.replaceLayerWithImage.getData({ entityIdentifier }, entityIdentifier.id),
    [entityIdentifier]
  );

  return (
    <EntityIdentifierContext.Provider value={entityIdentifier}>
      <ControlLayerAdapterGate>
        <CanvasEntityContainer>
          <CanvasEntityHeader>
            <CanvasEntityPreviewImage />
            <CanvasEntityEditableTitle />
            <Spacer />
            <ControlLayerBadges />
            <CanvasEntityHeaderCommonActions />
          </CanvasEntityHeader>
          <CanvasEntitySettingsWrapper>
            <ControlLayerControlAdapter />
          </CanvasEntitySettingsWrapper>
          <DndDropTarget targetData={targetData} label={t('controlLayers.replaceLayer')} />
        </CanvasEntityContainer>
      </ControlLayerAdapterGate>
    </EntityIdentifierContext.Provider>
  );
});

ControlLayer.displayName = 'ControlLayer';
