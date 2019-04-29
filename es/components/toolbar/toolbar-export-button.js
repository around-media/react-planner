import React from 'react';
import { object } from 'prop-types';
import { FaFileDownload as IconDownload } from 'react-icons/fa';
import ToolbarButton from './toolbar-button';

export default function ToolbarExportButton(_ref, _ref2) {
  var context = _ref.context,
      catalog = _ref.catalog;
  var translator = _ref2.translator;

  var saveProjectToFile = function saveProjectToFile(e) {
    e.preventDefault();
    var store = context.store;
    var exportProject = context.projectActions.exportProject;

    store.dispatch(exportProject(context, catalog));
  };

  return React.createElement(
    ToolbarButton,
    {
      active: false,
      tooltip: translator.t('Export project'),
      onClick: saveProjectToFile
    },
    React.createElement(IconDownload, null)
  );
}

ToolbarExportButton.propTypes = {
  state: object.isRequired
};

ToolbarExportButton.contextTypes = {
  translator: object.isRequired,
  store: object.isRequired
};