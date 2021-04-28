import React from 'react';

import Thumbnail from './Thumbnail';

export function _groupThumbnailsByPages(rowCount, rowElements) {
    const pageOrderedThumbnails = [];

    for (let i = 0; i < rowElements.length; i += rowCount) {
        pageOrderedThumbnails.push(rowElements.slice(i, i + rowCount));
    }

    return pageOrderedThumbnails;
}

export function _renderThumbnails(sortedParticipants, styleOverrides) {
    return sortedParticipants
        .map(participant => (
            // eslint-disable-next-line react/jsx-key
            <Thumbnail
                isDominantSpeaker = { participant?.dominantSpeaker }
                isGradientRequired = { !participant?.local }
                isNameRequired = { !participant?.local }
                isTileView = { true }
                participant = { participant }
                styleOverrides = { styleOverrides } />));
}
