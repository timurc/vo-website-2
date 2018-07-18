const React = require('react');

const Layout = require('./src/components/layout').default;

exports.replaceComponentRenderer = ({ props }) => {
    const { location } = props;
    console.log(props);
    return <Layout location={location}>{React.createElement(props.pageResources.component, props)}</Layout>;
};

class StateTest extends React.Component {
    constructor(props) {
        super(props);
        console.log('constructing.....'); // Does not fire on page transition!
    }
    render() {
        const { children } = this.props;
        return <div>{children}</div>;
    }
}
