import React from 'react';

export function DateFormatted({ date, className }) {
    const dateString = new Date(date).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        <time className={className} dateTime={date}>
            {dateString}
        </time>
    );
}
