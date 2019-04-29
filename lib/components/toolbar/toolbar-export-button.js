'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ToolbarExportButton;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _fa = require('react-icons/fa');

var _toolbarButton = require('./toolbar-button');

var _toolbarButton2 = _interopRequireDefault(_toolbarButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ToolbarExportButton(_ref, _ref2) {
  var context = _ref.context,
      catalog = _ref.catalog;
  var translator = _ref2.translator;

  var saveProjectToFile = function saveProjectToFile(e) {
    e.preventDefault();
    var store = context.store;
    var exportProject = context.projectActions.exportProject;

    store.dispatch(exportProject(context, catalog));
  };

  return _react2.default.createElement(
    _toolbarButton2.default,
    {
      active: false,
      tooltip: translator.t('Export project'),
      onClick: saveProjectToFile
    },
    _react2.default.createElement(_fa.FaFileDownload, null)
  );
}

ToolbarExportButton.propTypes = {
  state: _propTypes.object.isRequired
};

ToolbarExportButton.contextTypes = {
  translator: _propTypes.object.isRequired,
  store: _propTypes.object.isRequired
};