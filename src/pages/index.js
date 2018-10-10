import React from 'react';
import { BackgroundImageContext } from './../components/layout/background-image-context';

class Index extends React.Component {
    render() {
        return (
            <BackgroundImageContext.Consumer>
                {setBackgroundImage => {
                    setBackgroundImage();
                }}
            </BackgroundImageContext.Consumer>
        );
    }
}

export default Index;
