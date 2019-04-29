var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, Fragment } from 'react';
import { string, func, number, instanceOf, arrayOf, object, element, bool, array, oneOfType } from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Translator from './translator/translator';
import Catalog from './catalog/catalog';
import actions from './actions/export';
import { objectsMap } from './utils/objects-utils';
import { ToolbarComponents, Content, SidebarComponents, FooterBarComponents } from './components/export';
import { VERSION } from './version';
import './styles/export';

var Toolbar = ToolbarComponents.Toolbar;
var Sidebar = SidebarComponents.Sidebar;
var FooterBar = FooterBarComponents.FooterBar;


var toolbarW = 50;
var sidebarW = 300;
var footerBarH = 20;

var wrapperStyle = {
  display: 'flex',
  flexFlow: 'row nowrap'
};

var ReactPlanner = function (_Component) {
  _inherits(ReactPlanner, _Component);

  function ReactPlanner() {
    _classCallCheck(this, ReactPlanner);

    return _possibleConstructorReturn(this, (ReactPlanner.__proto__ || Object.getPrototypeOf(ReactPlanner)).apply(this, arguments));
  }

  _createClass(ReactPlanner, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _this2 = this;

      return _extends({}, objectsMap(actions, function (actionNamespace) {
        return _this2.props[actionNamespace];
      }), {
        translator: this.props.translator,
        catalog: this.props.catalog
      });
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var store = this.context.store;
      var _props = this.props,
          projectActions = _props.projectActions,
          catalog = _props.catalog,
          stateExtractor = _props.stateExtractor,
          plugins = _props.plugins;

      plugins.forEach(function (plugin) {
        return plugin(store, stateExtractor);
      });
      projectActions.initCatalog(catalog);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var stateExtractor = nextProps.stateExtractor,
          state = nextProps.state,
          projectActions = nextProps.projectActions,
          catalog = nextProps.catalog;

      var plannerState = stateExtractor(state);
      var catalogReady = plannerState.getIn(['catalog', 'ready']);
      if (!catalogReady) {
        projectActions.initCatalog(catalog);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height,
          state = _props2.state,
          stateExtractor = _props2.stateExtractor,
          CustomUI = _props2.CustomUI,
          className = _props2.className,
          props = _objectWithoutProperties(_props2, ['width', 'height', 'state', 'stateExtractor', 'CustomUI', 'className']);

      var contentW = width - toolbarW - sidebarW;
      var contentH = height - footerBarH;
      var toolbarH = height - footerBarH;
      var sidebarH = height - footerBarH;
      if (CustomUI) {
        contentW = width;
        contentH = height;
      }

      var extractedState = stateExtractor(state);
      var content = React.createElement(Content, _extends({
        width: contentW,
        height: contentH,
        state: extractedState
      }, props, {
        onWheel: function onWheel(event) {
          return event.preventDefault();
        }
      }));

      var planner = void 0;
      if (CustomUI) {
        contentW = width;
        contentH = height;
        planner = React.createElement(
          Fragment,
          null,
          React.createElement(CustomUI, _extends({
            state: extractedState
          }, props, {
            store: this.context.store
          })),
          content
        );
      } else {
        planner = React.createElement(
          Fragment,
          null,
          React.createElement(Toolbar, _extends({
            width: toolbarW,
            height: toolbarH,
            state: extractedState,
            store: this.context.store
          }, props)),
          content,
          React.createElement(Sidebar, _extends({
            width: sidebarW,
            height: sidebarH,
            state: extractedState
          }, props)),
          React.createElement(FooterBar, _extends({
            width: width,
            height: footerBarH,
            state: extractedState
          }, props))
        );
      }

      return React.createElement(
        'div',
        { className: className, style: _extends({}, wrapperStyle, { height: height }) },
        planner
      );
    }
  }]);

  return ReactPlanner;
}(Component);

ReactPlanner.propTypes = {
  translator: instanceOf(Translator),
  catalog: instanceOf(Catalog),
  allowProjectFileSupport: bool,
  plugins: arrayOf(func),
  autosaveKey: string,
  autosaveDelay: number,
  width: number.isRequired,
  height: number.isRequired,
  stateExtractor: func.isRequired,
  toolbarButtons: array,
  sidebarComponents: array,
  footerbarComponents: array,
  customContents: object,
  softwareSignature: string,
  CustomUI: oneOfType([element, func]),
  className: string
};

ReactPlanner.contextTypes = {
  store: object.isRequired
};

ReactPlanner.childContextTypes = _extends({}, objectsMap(actions, function () {
  return object;
}), {
  translator: object,
  catalog: object,
  store: object
});

ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  softwareSignature: 'React-Planner ' + VERSION,
  toolbarButtons: [],
  sidebarComponents: [],
  footerbarComponents: [],
  customContents: {},
  CustomUI: null,
  className: ''
};

//redux connect
function mapStateToProps(reduxState) {
  return {
    state: reduxState
  };
}

function mapDispatchToProps(dispatch) {
  return objectsMap(actions, function (actionNamespace) {
    return bindActionCreators(actions[actionNamespace], dispatch);
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactPlanner);