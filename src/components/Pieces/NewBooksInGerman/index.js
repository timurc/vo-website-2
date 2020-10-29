import React, { useEffect, useRef } from 'react';
import s from './style.module.less';

export default {
    component: function() {
        const boundaryContainer = useRef(null);

        useEffect(() => {
            createButtons(boundaryContainer.current);
            const resize = () => {
                createButtons(boundaryContainer.current);
            };
            window.addEventListener('resize', resize);

            return () => {
                window.removeEventListener('resize', resize);
            };
        }, []);
        return (
            <div className={s.container}>
                <div className={s.inner} ref={boundaryContainer} />
            </div>
        );
    },
};

const BOOK_WIDTH = 15;
const BOOK_MARGIN = 5;

// MORE OR LESS COPIED OVER FROM ORIGINAL PROJECT
function createButtons(el) {
    el.innerHTML = '';
    const isSmall = window.matchMedia('(max-width: 400px)').matches;
    const buttons = el.dataset.settings ? JSON.parse(el.dataset.settings) : [];

    const containerWidth = el.offsetWidth;
    const bookCount = Math.floor((containerWidth - 1) / (BOOK_WIDTH + BOOK_MARGIN));
    const buttonDistance = Math.round(bookCount / (buttons.length + 1));

    const buttonsWithPosition = buttons.map((button, index) => {
        if (isSmall) {
            button.position = buttonDistance * index;
        } else {
            button.position = buttonDistance * (index + 1);
        }
        return button;
    });

    const books = new Array(bookCount).fill('').map((el, index) => {
        let buttonString = `<div class=${s.book} style="width: ${BOOK_WIDTH}px; margin-right: ${BOOK_MARGIN}px"></div>`;

        if (buttonsWithPosition[0] && buttonsWithPosition[0].position === index) {
            buttonString += `<a href="${buttonsWithPosition[0].link.url}" class="intro-link">
        <span>${buttonsWithPosition[0].label_1}</span>
        <div>${buttonsWithPosition[0].label_2}</div>
      </a>`;
            buttonsWithPosition.shift();
        }

        return buttonString;
    });

    el.innerHTML = books.join('');

    Array.from(el.getElementsByClassName('intro-link')).forEach((linkEl, index) => {
        const widthInBooks = Math.ceil(linkEl.querySelector('span').offsetWidth / (BOOK_WIDTH + BOOK_MARGIN));
        let currentElement = linkEl;
        for (let i = 0; i < widthInBooks; i++) {
            currentElement = currentElement.nextSibling;
            currentElement.classList.add('above-button');
        }

        if (window.matchMedia('(hover: none)').matches) {
            setTimeout(() => {
                liftBooks(100);
            }, index * 500);
        }

        linkEl.addEventListener('mouseenter', () => {
            liftBooks(50);
        });

        linkEl.addEventListener('mouseleave', () => {
            lowerBooks(50);
        });

        function liftBooks(delay) {
            let currentElement = linkEl;
            for (let i = 0; i < widthInBooks; i++) {
                setTimeout(() => {
                    currentElement = currentElement && currentElement.nextSibling;
                    if (currentElement) {
                        currentElement.style.transform = `translateY(calc(-1.2em - ${i}px)) rotate(-2deg)`;
                        currentElement.classList.add('up');
                    }
                }, delay * i);
            }
        }

        function lowerBooks(delay) {
            let currentElement = linkEl;
            for (let i = 0; i < widthInBooks; i++) {
                setTimeout(() => {
                    if (currentElement) {
                        currentElement = currentElement.nextSibling;
                        currentElement.style.transform = ``;
                        currentElement.classList.remove('up');
                    }
                }, delay * i);
            }
        }
    });
}
