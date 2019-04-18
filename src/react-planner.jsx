import React, { Component, Fragment } from 'react';
import {
  string,
  func,
  number,
  instanceOf,
  arrayOf,
  object,
  element,
  bool,
  array,
  oneOfType
} from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Translator from './translator/translator';
import Catalog from './catalog/catalog';
import actions from './actions/export';
import { objectsMap } from './utils/objects-utils';
import {
  ToolbarComponents,
  Content,
  SidebarComponents,
  FooterBarComponents
} from './components/export';
import { VERSION } from './version';
import './styles/export';

const { Toolbar } = ToolbarComponents;
const { Sidebar } = SidebarComponents;
const { FooterBar } = FooterBarComponents;

const toolbarW = 50;
const sidebarW = 300;
const footerBarH = 20;

const wrapperStyle = {
  display: 'flex',
  flexFlow: 'row nowrap'
};

class ReactPlanner extends Component {
  getChildContext() {
    return {
      ...objectsMap(actions, actionNamespace => this.props[actionNamespace]),
      translator: this.props.translator,
      catalog: this.props.catalog
    };
  }

  componentWillMount() {
    let { store } = this.context;
    let { projectActions, catalog, stateExtractor, plugins } = this.props;
    plugins.forEach(plugin => plugin(store, stateExtractor));
    projectActions.initCatalog(catalog);
  }

  componentWillReceiveProps(nextProps) {
    let { stateExtractor, state, projectActions, catalog } = nextProps;
    let plannerState = stateExtractor(state);
    let catalogReady = plannerState.getIn(['catalog', 'ready']);
    if (!catalogReady) {
      projectActions.initCatalog(catalog);
    }
  }

  render() {
    let {
      width,
      height,
      state,
      stateExtractor,
      CustomUI,
      className,
      ...props
    } = this.props;

    let contentW = width - toolbarW - sidebarW;
    let contentH = height - footerBarH;
    let toolbarH = height - footerBarH;
    let sidebarH = height - footerBarH;
    if (CustomUI) {
      contentW = width;
      contentH = height;
    }

    let extractedState = stateExtractor(state);
    const content = (
      <Content
        width={contentW}
        height={contentH}
        state={extractedState}
        {...props}
        onWheel={event => event.preventDefault()}
      />
    );

    let planner;
    if (CustomUI) {
      contentW = width;
      contentH = height;
      planner = (
        <Fragment>
          <CustomUI state={extractedState} {...props} />
          {content}
        </Fragment>
      );
    } else {
      planner = (
        <Fragment>
          <Toolbar
            width={toolbarW}
            height={toolbarH}
            state={extractedState}
            {...props}
          />
          {content}
          <Sidebar
            width={sidebarW}
            height={sidebarH}
            state={extractedState}
            {...props}
          />
          <FooterBar
            width={width}
            height={footerBarH}
            state={extractedState}
            {...props}
          />
        </Fragment>
      );
    }

    return (
      <div className={className} style={{ ...wrapperStyle, height }}>
        {planner}
      </div>
    );
  }
}

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
  CustomUI: oneOfType(element, func),
  className: string
};

ReactPlanner.contextTypes = {
  store: object.isRequired
};

ReactPlanner.childContextTypes = {
  ...objectsMap(actions, () => object),
  translator: object,
  catalog: object
};

ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  softwareSignature: `React-Planner ${VERSION}`,
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
  return objectsMap(actions, actionNamespace =>
    bindActionCreators(actions[actionNamespace], dispatch)
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactPlanner);
