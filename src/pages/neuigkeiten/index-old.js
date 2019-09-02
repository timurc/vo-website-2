import React from 'react';
import News from '../../components/OverviewList';
import { BackgroundImageContext } from '../../components/layout/background-image-context';

function NewsIndex({ location }) {
    return (
        <News location={location}>
            <BackgroundImageContext.Consumer>
                {setBackgroundImage => {
                    setBackgroundImage();
                }}
            </BackgroundImageContext.Consumer>
        </News>
    );
}

export default NewsIndex;
