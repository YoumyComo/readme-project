"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PropTypes = require("prop-types");
exports.ContextTypes = {
    serverRending: PropTypes.bool,
    dependences: PropTypes.objectOf(PropTypes.bool),
};
exports.default = (Target) => {
    class Context extends React.Component {
        getChildContext() {
            const context = Object.assign({}, this.context, this.props.context);
            return context;
        }
        render() {
            return React.createElement(Target, this.props || {});
        }
    }
    Context.childContextTypes = exports.ContextTypes;
    return Context;
};
//# sourceMappingURL=traceDependencies.js.map