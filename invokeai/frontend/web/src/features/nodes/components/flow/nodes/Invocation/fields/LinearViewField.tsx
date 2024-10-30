import { Flex, Icon, IconButton, Spacer, Tooltip } from '@invoke-ai/ui-library';
import { useAppDispatch } from 'app/store/storeHooks';
import NodeSelectionOverlay from 'common/components/NodeSelectionOverlay';
import { InvocationInputFieldCheck } from 'features/nodes/components/flow/nodes/Invocation/fields/InvocationFieldCheck';
import { useFieldOriginalValue } from 'features/nodes/hooks/useFieldOriginalValue';
import { useMouseOverNode } from 'features/nodes/hooks/useMouseOverNode';
import { workflowExposedFieldRemoved } from 'features/nodes/store/workflowSlice';
import { HANDLE_TOOLTIP_OPEN_DELAY } from 'features/nodes/types/constants';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PiArrowCounterClockwiseBold, PiDotsSixVerticalBold, PiInfoBold, PiTrashSimpleBold } from 'react-icons/pi';

import EditableFieldTitle from './EditableFieldTitle';
import FieldTooltipContent from './FieldTooltipContent';
import InputFieldRenderer from './InputFieldRenderer';

type Props = {
  nodeId: string;
  fieldName: string;
};

const LinearViewFieldInternal = ({ nodeId, fieldName }: Props) => {
  const dispatch = useAppDispatch();
  const { isValueChanged, onReset } = useFieldOriginalValue(nodeId, fieldName);
  const { isMouseOverNode, handleMouseOut, handleMouseOver } = useMouseOverNode(nodeId);
  const { t } = useTranslation();

  const handleRemoveField = useCallback(() => {
    dispatch(workflowExposedFieldRemoved({ nodeId, fieldName }));
  }, [dispatch, fieldName, nodeId]);

  return (
    <Flex
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
      layerStyle="second"
      alignItems="center"
      position="relative"
      borderRadius="base"
      w="full"
      p={4}
      paddingLeft={0}
    >
      <IconButton
        aria-label={t('nodes.reorderLinearView')}
        variant="ghost"
        icon={<PiDotsSixVerticalBold />}
        mx={2}
        height="full"
      />
      <Flex flexDir="column" w="full">
        <Flex alignItems="center">
          <EditableFieldTitle nodeId={nodeId} fieldName={fieldName} kind="inputs" />
          <Spacer />
          {isValueChanged && (
            <IconButton
              aria-label={t('nodes.resetToDefaultValue')}
              tooltip={t('nodes.resetToDefaultValue')}
              variant="ghost"
              size="sm"
              onClick={onReset}
              icon={<PiArrowCounterClockwiseBold />}
            />
          )}
          <Tooltip
            label={<FieldTooltipContent nodeId={nodeId} fieldName={fieldName} kind="inputs" />}
            openDelay={HANDLE_TOOLTIP_OPEN_DELAY}
            placement="top"
          >
            <Flex h="full" alignItems="center">
              <Icon fontSize="sm" color="base.300" as={PiInfoBold} />
            </Flex>
          </Tooltip>
          <IconButton
            aria-label={t('nodes.removeLinearView')}
            tooltip={t('nodes.removeLinearView')}
            variant="ghost"
            size="sm"
            onClick={handleRemoveField}
            icon={<PiTrashSimpleBold />}
          />
        </Flex>
        <InputFieldRenderer nodeId={nodeId} fieldName={fieldName} />
        <NodeSelectionOverlay isSelected={false} isHovered={isMouseOverNode} />
      </Flex>
    </Flex>
  );
};

const LinearViewField = ({ nodeId, fieldName }: Props) => {
  return (
    <InvocationInputFieldCheck nodeId={nodeId} fieldName={fieldName}>
      <LinearViewFieldInternal nodeId={nodeId} fieldName={fieldName} />
    </InvocationInputFieldCheck>
  );
};

export default memo(LinearViewField);
