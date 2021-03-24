import _ from 'lodash';
import React from 'react';
import { View } from 'react-native';

import { THUMBNAIL_ASPECT_RATIO } from '../../constants';

import {
    _groupThumbnailsByPages,
    _renderThumbnails
} from './commonGalleryViewGenerators';
import styles from './styles';

const COLUMN_COUNT = 2;

function constructPhoneGalleryView(sortedParticipants, thumbnailDimensions, rowCount) {
    if (_.isNil(sortedParticipants)
        || _.isNil(thumbnailDimensions)
        || _.isNil(rowCount)) {
        return <View />;
    }

    const styleOverrides = {
        aspectRatio: THUMBNAIL_ASPECT_RATIO,
        minHeight: thumbnailDimensions.height,
        maxWidth: thumbnailDimensions.width
    };

    return _getUserPages(
            _groupThumbnailsByPages(
                rowCount,
                _groupIntoRows(
                    _renderThumbnails(sortedParticipants, styleOverrides)),
                thumbnailDimensions));
}

function _getUserPages(userGrid) {
    return userGrid.map((page, pageIndex) =>
        (<View
            key = { pageIndex }
            style = { styles.tileColumns }>
            {page.map((row, rowIndex) =>
                (<View
                    key = { rowIndex + pageIndex }
                    style = { styles.tileRows }>
                    {row}
                </View>)
            )}
        </View>));
}


function _groupIntoRows(thumbnails) {
    const finalRows = [];

    for (let i = 0; i < thumbnails.length; i += COLUMN_COUNT) {
        finalRows.push(thumbnails.slice(i, i + COLUMN_COUNT));
    }

    return finalRows;
}


export default constructPhoneGalleryView;
