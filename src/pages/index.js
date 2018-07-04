import React from 'react';

import Layout from '../components/layout';

class BlogIndex extends React.Component {
    render() {
        return <Layout location={this.props.location} />;
    }
}

export default BlogIndex;
