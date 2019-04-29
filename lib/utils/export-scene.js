'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ColladaExporter = require('three/examples/jsm/exporters/ColladaExporter');

var _xmlJs = require('xml-js');

var _fileSaver = require('file-saver');

var _export = require('../class/export');

var _sceneCreator = require('../components/viewer3d/scene-creator');

var exportScene = function exportScene(_ref) {
  var state = _ref.state,
      context = _ref.context,
      catalog = _ref.catalog;

  state = _export.Project.unselectAll(state).updatedState;
  var actions = {
    areaActions: context.areaActions,
    holesActions: context.holesActions,
    itemsActions: context.itemsActions,
    linesActions: context.linesActions,
    projectActions: context.projectActions
  };

  var scene = state.get('scene');
  // LOAD DATA
  var planData = (0, _sceneCreator.parseData)(scene, actions, catalog);

  setTimeout(function () {
    var exporter = new _ColladaExporter.ColladaExporter();
    exporter.parse(planData.plan, function (_ref2) {
      var data = _ref2.data;

      var parsedFile = (0, _xmlJs.xml2js)(data, { compact: true });
      parsedFile.COLLADA.asset['unit'] = {
        _attributes: { name: 'centimeter', meter: '0.01' }
      };
      var fixedData = (0, _xmlJs.js2xml)(parsedFile, { compact: true, spaces: 4 });

      var fileBlob = new Blob([fixedData], {
        type: 'text/plain;charset=utf-8'
      });

      (0, _fileSaver.saveAs)(fileBlob, 'planner.DAE');
    });
  }, 1000);
};

exports.default = exportScene;