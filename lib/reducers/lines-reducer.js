'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, action) {
  switch (action.type) {
    case _constants.SELECT_TOOL_DRAWING_LINE:
      return _export.Line.selectToolDrawingLine(state, action.sceneComponentType).updatedState;

    case _constants.BEGIN_DRAWING_LINE:
      state = state.merge({
        sceneHistory: _export2.history.historyPush(state.sceneHistory, state.scene)
      });
      return _export.Line.beginDrawingLine(state, action.layerID, action.x, action.y).updatedState;

    case _constants.UPDATE_DRAWING_LINE:
      return _export.Line.updateDrawingLine(state, action.x, action.y).updatedState;

    case _constants.END_DRAWING_LINE:
      state = state.merge({
        sceneHistory: _export2.history.historyPush(state.sceneHistory, state.scene)
      });
      return _export.Line.endDrawingLine(state, action.x, action.y).updatedState;

    case _constants.RESTART_DRAWING_LINE:
      var amountOfAreas = state.getIn(['scene', 'layers', action.layerID, 'areas']);
      // Check if it needs to restart by checking if a new area was created
      // after ending the line
      state = state.merge({
        sceneHistory: _export2.history.historyPush(state.sceneHistory, state.scene)
      });
      var newState = _export.Line.endDrawingLine(state, action.x, action.y).updatedState;

      var newAmountOfAreas = newState.getIn(['scene', 'layers', action.layerID, 'areas']);

      // Begin drawing again if the amount of areas stays the same
      if (newAmountOfAreas.size === amountOfAreas.size) {
        newState = newState.merge({
          sceneHistory: _export2.history.historyPush(newState.sceneHistory, newState.scene)
        });
        return _export.Line.beginDrawingLine(newState, action.layerID, action.x, action.y).updatedState;
      } else {
        return newState;
      }

    case _constants.BEGIN_DRAGGING_LINE:
      state = state.merge({
        sceneHistory: _export2.history.historyPush(state.sceneHistory, state.scene)
      });
      return _export.Line.beginDraggingLine(state, action.layerID, action.lineID, action.x, action.y).updatedState;

    case _constants.UPDATE_DRAGGING_LINE:
      return _export.Line.updateDraggingLine(state, action.x, action.y).updatedState;

    case _constants.END_DRAGGING_LINE:
      state = state.merge({
        sceneHistory: _export2.history.historyPush(state.sceneHistory, state.scene)
      });
      return _export.Line.endDraggingLine(state, action.x, action.y).updatedState;

    case _constants.SELECT_LINE:
      return _export.Line.select(state, action.layerID, action.lineID).updatedState;

    default:
      return state;
  }
};

var _export = require('../class/export');

var _export2 = require('../utils/export');

var _constants = require('../constants');