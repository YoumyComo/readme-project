"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const loader_1 = require("@client/services/loader");
const traceDependencies_1 = require("@client/lib/traceDependencies");
class LazyLoad extends React.Component {
    constructor(props) {
        super(props);
        this.didMount = false;
        this.state = {
            Component: null,
        };
        const { loader } = props;
        loader_1.ref();
        loader((c) => {
            if (c.default)
                c = c.default;
            if (this.didMount) {
                this.setState({
                    Component: c
                });
            }
            else {
                this.state = {
                    Component: c,
                };
            }
            loader_1.unref();
        });
    }
    componentDidMount() {
        this.didMount = true;
    }
    render() {
        const { subProps, chunk } = this.props;
        if (this.context && this.context.dependences) {
            this.context.dependences[chunk] = true;
        }
        const { Component } = this.state;
        if (Component) {
            return React.createElement(Component, Object.assign({}, subProps));
        }
        else {
            return null;
        }
    }
}
LazyLoad.contextTypes = traceDependencies_1.ContextTypes;
exports.default = LazyLoad;
//# sourceMappingURL=index.js.map