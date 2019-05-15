import { Line } from '../class/export';
import { history } from '../utils/export';
import { SELECT_TOOL_DRAWING_LINE, BEGIN_DRAWING_LINE, UPDATE_DRAWING_LINE, END_DRAWING_LINE, RESTART_DRAWING_LINE, BEGIN_DRAGGING_LINE, UPDATE_DRAGGING_LINE, END_DRAGGING_LINE, SELECT_LINE } from '../constants';

export default function (state, action) {
  switch (action.type) {
    case SELECT_TOOL_DRAWING_LINE:
      return Line.selectToolDrawingLine(state, action.sceneComponentType).updatedState;

    case BEGIN_DRAWING_LINE:
      state = state.merge({
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      });
      return Line.beginDrawingLine(state, action.layerID, action.x, action.y).updatedState;

    case UPDATE_DRAWING_LINE:
      return Line.updateDrawingLine(state, action.x, action.y).updatedState;

    case END_DRAWING_LINE:
      state = state.merge({
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      });
      return Line.endDrawingLine(state, action.x, action.y).updatedState;

    case RESTART_DRAWING_LINE:
      var amountOfAreas = state.getIn(['scene', 'layers', action.layerID, 'areas']);
      // Check if it needs to restart by checking if a new area was created
      // after ending the line
      state = state.merge({
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      });
      var newState = Line.endDrawingLine(state, action.x, action.y).updatedState;

      var newAmountOfAreas = newState.getIn(['scene', 'layers', action.layerID, 'areas']);

      // Begin drawing again if the amount of areas stays the same
      if (newAmountOfAreas.size === amountOfAreas.size) {
        newState = newState.merge({
          sceneHistory: history.historyPush(newState.sceneHistory, newState.scene)
        });
        return Line.beginDrawingLine(newState, action.layerID, action.x, action.y).updatedState;
      } else {
        return newState;
      }

    case BEGIN_DRAGGING_LINE:
      state = state.merge({
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      });
      return Line.beginDraggingLine(state, action.layerID, action.lineID, action.x, action.y).updatedState;

    case UPDATE_DRAGGING_LINE:
      return Line.updateDraggingLine(state, action.x, action.y).updatedState;

    case END_DRAGGING_LINE:
      state = state.merge({
        sceneHistory: history.historyPush(state.sceneHistory, state.scene)
      });
      return Line.endDraggingLine(state, action.x, action.y).updatedState;

    case SELECT_LINE:
      return Line.select(state, action.layerID, action.lineID).updatedState;

    default:
      return state;
  }
}