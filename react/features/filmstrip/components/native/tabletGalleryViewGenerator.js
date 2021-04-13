import _ from 'lodash';
import React from 'react';
import { Image, View } from 'react-native';

import {
    TABLET_GALLERY_COLUMN_COUNT,
    THUMBNAIL_ASPECT_RATIO
} from '../../constants';

import Thumbnail from './Thumbnail';
import {
    _groupThumbnailsByPages,
    _renderThumbnails
} from './commonGalleryViewGenerators';
import styles from './styles';

const IN_FOCUS_SCALE = 3;
const THUMBNAIL_IN_FOCUS_ASPECT_RATIO = 3 / 2;

function constructTabletGalleryView(sortedParticipants, placeholderImageUrl, thumbnailDimensions, rowCount) {
    if (_.isNil(sortedParticipants)
        || _.isNil(placeholderImageUrl)
        || _.isNil(thumbnailDimensions)
        || _.isNil(rowCount)) {
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
            rowCount,
            _groupIntoRows(
                _renderThumbnails(galleryParticipants, styleOverrides))));
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
                        source = {{
                            uri: placeholderImageUrl
                        }}
                        style = {{ ...styles.fillView,
                            ...inFocusStyleOverrides }} />
                    : <Thumbnail
                        inFocusStyle = { true }
                        isAvatarCircled = { false }
                        isDominantSpeaker = { inFocusUser.dominantSpeaker }
                        isNameRequired = { true }
                        isTabletDesignEnabled = { true }
                        isTabletVipDesignEnabled = { true }
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

function _groupIntoRows(thumbnails) {
    const finalRows = [];

    for (let i = 0; i < thumbnails.length; i += TABLET_GALLERY_COLUMN_COUNT) {
        if (i < TABLET_GALLERY_COLUMN_COUNT) {
            finalRows.push(
                        thumbnails.slice(i, i + TABLET_GALLERY_COLUMN_COUNT - IN_FOCUS_SCALE));
            i -= IN_FOCUS_SCALE;
        } else {
            finalRows.push(thumbnails.slice(i, i + TABLET_GALLERY_COLUMN_COUNT));
        }
    }

    return finalRows;
}

export default constructTabletGalleryView;
