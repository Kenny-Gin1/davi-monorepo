import React, { useEffect } from 'react';
import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';

import { useTypedParams } from 'Modules/Guilds/Hooks/useTypedParams';
import {
  RichContractData,
  RichContractFunction,
} from 'hooks/Guilds/contracts/useRichContractRegistry';
import {
  defaultValues,
  getEditor,
  supportedActions,
} from 'components/ActionsBuilder/SupportedActions';

import {
  DecodedAction,
  DecodedCall,
  SupportedAction,
} from 'components/ActionsBuilder/types';
import { Modal } from 'components/primitives/Modal';
import {
  ContractActionsList,
  ApproveSpendTokens,
  ContractsList,
  ParamsForm,
} from './components';
import { EditorWrapper } from './ActionsModal.styled';
import { ActionModalProps, SelectedFunction } from './types';
import { TokenSpendApproval } from './components/ApproveSpendTokens/ApproveSpendTokens';
import { useHookStoreProvider } from 'stores';

const ActionModal: React.FC<ActionModalProps> = ({
  action,
  isOpen,
  setIsOpen,
  onAddActions,
  onEditAction,
  isEditing,
}) => {
  const { t } = useTranslation();
  const { guildId } = useTypedParams();
  const {
    hooks: {
      fetchers: { useGuildConfig },
    },
  } = useHookStoreProvider();
  const { data: guildConfig } = useGuildConfig(guildId);
  // Supported Actions
  const [selectedAction, setSelectedAction] =
    React.useState<SupportedAction>(null);

  // Generic calls
  const [selectedContract, setSelectedContract] =
    React.useState<RichContractData>(null);
  const [selectedFunction, setSelectedFunction] =
    React.useState<SelectedFunction>(null);

  const [data, setData] = React.useState<DecodedCall>(null);
  const [showTokenApprovalForm, setShowTokenApprovalForm] =
    React.useState(false);
  const [payableFnData, setPayableFnData] =
    React.useState<TokenSpendApproval>(null);

  useEffect(() => {
    if (!action?.decodedCall) return;

    if (action.decodedCall.callType === SupportedAction.GENERIC_CALL) {
      setSelectedContract(action.decodedCall.richData);
      setSelectedFunction({
        name: action.decodedCall.function.name,
        title: action.decodedCall.functionTitle,
      });
    } else {
      setSelectedAction(action.decodedCall.callType);
    }

    setData(action.decodedCall);
    setPayableFnData(action.approval);
    setShowTokenApprovalForm(action.approval ? true : false);
  }, [action]);

  function isSelectedFunction(
    fn: RichContractFunction,
    selectedFunction: SelectedFunction
  ) {
    return (
      fn.functionName === selectedFunction.name &&
      (selectedFunction.title === '' || fn.title === selectedFunction.title)
    );
  }

  function getHeader() {
    if (selectedFunction) {
      return selectedContract.functions.find(fn =>
        isSelectedFunction(fn, selectedFunction)
      )?.title;
    }

    if (selectedContract) {
      return selectedContract?.title;
    }

    if (selectedAction) {
      return supportedActions[selectedAction].title;
    }

    return t('addAction');
  }

  function getContent() {
    if (selectedFunction) {
      const contractInterface = selectedContract.contractInterface;
      const contractId = selectedContract.contractAddress;
      const fn = selectedContract.functions.find(fn =>
        isSelectedFunction(fn, selectedFunction)
      );
      const isPayable: boolean = fn?.spendsTokens;
      // Return approval form if function is marked with spendsTokens=true
      if (showTokenApprovalForm || (isPayable && !payableFnData)) {
        return (
          <ApproveSpendTokens
            defaultValue={payableFnData}
            onConfirm={values => {
              setPayableFnData(values);
              setShowTokenApprovalForm(false);
            }}
          />
        );
      }

      return (
        <ParamsForm
          fn={fn}
          defaultValues={data?.args}
          onSubmit={args => {
            const submitAction = {
              id:
                isEditing && !!action?.id
                  ? action.id
                  : `action-${Math.random()}`,
              contract: contractInterface,
              decodedCall: {
                callType: SupportedAction.GENERIC_CALL,
                from: guildId,
                to: contractId,
                function: contractInterface.getFunction(selectedFunction.name),
                value: BigNumber.from(0),
                args,
                richData: selectedContract,
                functionTitle: selectedFunction.title,
              },
              ...(isPayable &&
                !!payableFnData && {
                  approval: {
                    callType: SupportedAction.GENERIC_CALL,
                    from: guildId,
                    to: payableFnData?.token,
                    value: BigNumber.from(0),
                    function: null,
                    args: {},
                    ...payableFnData,
                  },
                }),
            };
            if (isEditing && onEditAction) onEditAction(submitAction);
            else if (onAddActions) onAddActions([submitAction]);
            handleClose();
          }}
        />
      );
    }

    if (selectedContract) {
      return (
        <ContractActionsList
          contract={selectedContract}
          onSelect={setSelectedFunction}
        />
      );
    }

    if (selectedAction) {
      const Editor = getEditor(selectedAction);

      return (
        <EditorWrapper data-testid="actions-modal-editor">
          <Editor
            decodedCall={data}
            updateCall={setData}
            onSubmit={handleEditorSubmit}
            isEdit={isEditing}
          />
        </EditorWrapper>
      );
    }

    return (
      <ContractsList
        onSelect={setSelectedContract}
        onSupportedActionSelect={setSupportedAction}
      />
    );
  }

  function goBack() {
    if (selectedFunction) {
      setSelectedFunction(null);
      setPayableFnData(null);
    } else if (selectedContract) {
      setSelectedContract(null);
    } else if (selectedAction) {
      setSelectedAction(null);
    }

    setData(null);
  }

  function setSupportedAction(action: SupportedAction) {
    const defaultDecodedAction = defaultValues[action];
    if (!defaultDecodedAction) return null;

    defaultDecodedAction.decodedCall.from = guildId;
    defaultDecodedAction.decodedCall.callType = action;
    switch (action) {
      case SupportedAction.REP_MINT:
        defaultDecodedAction.decodedCall.to = guildConfig?.token;
        break;
      case SupportedAction.SET_PERMISSIONS:
        defaultDecodedAction.decodedCall.args.from = guildId;
        defaultDecodedAction.decodedCall.to = guildConfig?.permissionRegistry;
        break;
      case SupportedAction.SET_GUILD_CONFIG:
        defaultDecodedAction.decodedCall.to = guildId;
    }
    setData(defaultDecodedAction.decodedCall);
    setSelectedAction(action);
  }

  function buildAction(decodedCall: DecodedCall): DecodedAction {
    if (!decodedCall) return null;
    const defaultDecodedAction = defaultValues[decodedCall.callType];

    const decodedAction: DecodedAction = {
      id: isEditing && !!action?.id ? action.id : `action-${Math.random()}`, // Mantain id if is edit mode & id is exists
      decodedCall,
      contract: defaultDecodedAction.contract,
    };
    return decodedAction;
  }

  function handleEditorSubmit(calls?: DecodedCall[]) {
    if (!calls) return;
    if (isEditing && onEditAction) onEditAction(buildAction(calls[0]));
    else onAddActions(calls.map(buildAction));
    handleClose();
  }

  const handleClose = () => {
    setSelectedFunction(null);
    setSelectedContract(null);
    setSelectedAction(null);
    setPayableFnData(null);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleClose}
      header={getHeader()}
      maxWidth={300}
      backnCross={!action && (!!selectedAction || !!selectedContract)}
      prevContent={goBack}
    >
      {getContent()}
    </Modal>
  );
};

export default ActionModal;
