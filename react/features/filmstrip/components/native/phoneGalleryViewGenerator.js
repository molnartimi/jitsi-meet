import _ from 'lodash';
import React from 'react';
import { Dimensions, View } from 'react-native';

import { THUMBNAIL_ASPECT_RATIO, TILE_MARGIN } from '../../constants';

import {
    _groupThumbnailsByPages,
    _renderThumbnails
} from './commonGalleryViewGenerators';
import styles from './styles';

const COLUMN_COUNT = 2;

function constructPhoneGalleryView(sortedParticipants, thumbnailDimensions) {
    if (_.isNil(sortedParticipants) || _.isNil(thumbnailDimensions)) {
        return <View />;
    }

    const styleOverrides = {
        aspectRatio: THUMBNAIL_ASPECT_RATIO,
        minHeight: thumbnailDimensions.height,
        maxWidth: thumbnailDimensions.width
    };

    return _getUserPages(
            _groupThumbnailsByPages(
                _calculateRowCount(thumbnailDimensions),
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

function _calculateRowCount(thumbnailDimensions) {
    const heightToUse = Dimensions.get('window').height - (TILE_MARGIN * 2);
    const tileHeight = thumbnailDimensions.height;

    return Math.floor(heightToUse / tileHeight);
}

function _groupIntoRows(thumbnails) {
    const finalRows = [];

    for (let i = 0; i < thumbnails.length; i += COLUMN_COUNT) {
        finalRows.push(thumbnails.slice(i, i + COLUMN_COUNT));
    }

    return finalRows;
}


export default constructPhoneGalleryView;
