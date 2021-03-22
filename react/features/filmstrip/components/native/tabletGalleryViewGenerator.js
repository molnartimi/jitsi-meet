import _ from 'lodash';
import React from 'react';
import { Image, View } from 'react-native';

import { THUMBNAIL_ASPECT_RATIO } from '../../constants';

import Thumbnail from './Thumbnail';
import {
    _groupThumbnailsByPages,
    _renderThumbnails
} from './commonGalleryViewGenerators';
import styles from './styles';

const ROW_COUNT = 3;
const IN_FOCUS_SCALE = 3;
const THUMBNAIL_IN_FOCUS_ASPECT_RATIO = 3 / 2;

function constructTabletGalleryView(sortedParticipants, placeholderImageUrl, thumbnailDimensions, columnCount) {
    if (_.isNil(sortedParticipants) || _.isNil(thumbnailDimensions) || _.isNil(columnCount)) {
        return <View />;
    }

    const marginMultiplier = 1.02;

    const styleOverrides = {
        aspectRatio: THUMBNAIL_ASPECT_RATIO,
        minHeight: thumbnailDimensions?.height,
        maxWidth: thumbnailDimensions?.width * marginMultiplier
    };

    const inFocusStyleOverrides = {
        ...styleOverrides,
        aspectRatio: THUMBNAIL_IN_FOCUS_ASPECT_RATIO / marginMultiplier,
        maxWidth: thumbnailDimensions?.width * IN_FOCUS_SCALE
    };

    const inFocusUser = sortedParticipants?.find(p => p.currentfocus);
    const galleryParticipants = sortedParticipants?.filter(p => _.isNil(p.currentfocus) || !p.currentfocus);

    return _getUserPages(
        inFocusUser,
        inFocusStyleOverrides,
        placeholderImageUrl,
        _groupThumbnailsByPages(
            ROW_COUNT,
            _groupIntoRows(
                _renderThumbnails(galleryParticipants, styleOverrides),
                columnCount)));
}

function _getUserPages(inFocusUser, inFocusStyleOverrides, placeholderImageUrl, userGrid) {
    const userPages = [];

    userPages.push(
        <View
            style = {{
                ...styles.tileColumns,
                ...styles.tileView
            }}>
            <View
                style = { styles.tileRows }>
                {_.isNil(inFocusUser)
                    ? <Image
                        source = { require('../../../../../resources/img/default_user_icon.png') }
                        style = {{ ...styles.fillView,
                            ...inFocusStyleOverrides }} />
                    : <Thumbnail
                        isAvatarCircled = { false }
                        isDominantSpeaker = { inFocusUser.dominantSpeaker }
                        isGradientRequired = { !inFocusUser.local }
                        isNameRequired = { false }
                        key = { inFocusUser.id }
                        participant = { inFocusUser }
                        renderDisplayName = { true }
                        styleOverrides = { inFocusStyleOverrides }
                        tileView = { true } />}
                <View
                    style = {{
                        ...styles.fillView,
                        ...styles.tileColumns
                    }}>
                    <View
                        style = { styles.tileRows }>
                        {userGrid[0][0]}
                    </View>
                    <View
                        style = { styles.tileRows }>
                        {userGrid[0][1]}
                    </View>
                </View>
            </View>
            <View
                style = { styles.tileRows }>
                {userGrid[0][2]}
            </View>
        </View>);

    userGrid.shift();

    userGrid.map((page, pageIndex) =>
        userPages.push(<View
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

    return userPages;
}

function _groupIntoRows(thumbnails, columnCount) {
    const rowLength = columnCount;
    const finalRows = [];

    for (let i = 0; i < thumbnails.length; i += rowLength) {
        if (i < rowLength) {
            finalRows.push(
                        thumbnails.slice(i, i + rowLength - IN_FOCUS_SCALE));
            i -= IN_FOCUS_SCALE;
        } else {
            finalRows.push(thumbnails.slice(i, i + rowLength));
        }
    }

    return finalRows;
}

export default constructTabletGalleryView;
