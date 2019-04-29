import { ColladaExporter } from 'three/examples/jsm/exporters/ColladaExporter';
import { xml2js, js2xml } from 'xml-js';

import { saveAs } from 'file-saver';
import { Project } from '../class/export';
import { parseData } from '../components/viewer3d/scene-creator';

var exportScene = function exportScene(_ref) {
  var state = _ref.state,
      context = _ref.context,
      catalog = _ref.catalog;

  state = Project.unselectAll(state).updatedState;
  var actions = {
    areaActions: context.areaActions,
    holesActions: context.holesActions,
    itemsActions: context.itemsActions,
    linesActions: context.linesActions,
    projectActions: context.projectActions
  };

  var scene = state.get('scene');
  // LOAD DATA
  var planData = parseData(scene, actions, catalog);

  setTimeout(function () {
    var exporter = new ColladaExporter();
    exporter.parse(planData.plan, function (_ref2) {
      var data = _ref2.data;

      var parsedFile = xml2js(data, { compact: true });
      parsedFile.COLLADA.asset['unit'] = {
        _attributes: { name: 'centimeter', meter: '0.01' }
      };
      var fixedData = js2xml(parsedFile, { compact: true, spaces: 4 });

      var fileBlob = new Blob([fixedData], {
        type: 'text/plain;charset=utf-8'
      });

      saveAs(fileBlob, 'planner.DAE');
    });
  }, 1000);
};

export default exportScene;