import _ from 'lodash';
import React from 'react';
import { Dimensions, View } from 'react-native';

import { TILE_ASPECT_RATIO, TILE_MARGIN } from '../../constants';

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
        aspectRatio: TILE_ASPECT_RATIO,
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

/**
     * Returns the page grids with user thumbnails from {@link userGrid}.
     *
     * @param {[][]} userGrid - User page matrix.
     *
     * @private
     * @returns {ReactElement[]}
     */
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

/**
     * Splits a list of thumbnails into React Elements with a maximum of
     * {@link rowLength} thumbnails in each.
     *
     * @param {Array} thumbnails - The list of thumbnails that should be split
     * into separate row groupings.
     * @param {number} rowLength - How many thumbnails should be in each row.
     * @private
     * @returns {ReactElement[]}
     */
function _groupIntoRows(thumbnails) {
    const finalRows = [];

    for (let i = 0; i < thumbnails.length; i += COLUMN_COUNT) {
        finalRows.push(thumbnails.slice(i, i + COLUMN_COUNT));
    }

    return finalRows;
}


export default constructPhoneGalleryView;
