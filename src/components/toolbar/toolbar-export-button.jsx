import React from 'react';
import { object } from 'prop-types';
import { FaFileDownload as IconDownload } from 'react-icons/fa';
import ToolbarButton from './toolbar-button';

export default function ToolbarExportButton(
  { context, catalog },
  { translator }
) {
  let saveProjectToFile = e => {
    e.preventDefault();
    const { store } = context;
    const { exportProject } = context.projectActions;
    store.dispatch(exportProject(context, catalog));
  };

  return (
    <ToolbarButton
      active={false}
      tooltip={translator.t('Export project')}
      onClick={saveProjectToFile}
    >
      <IconDownload />
    </ToolbarButton>
  );
}

ToolbarExportButton.propTypes = {
  state: object.isRequired
};

ToolbarExportButton.contextTypes = {
  translator: object.isRequired,
  store: object.isRequired
};
