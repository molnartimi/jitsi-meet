import _ from 'lodash';
import React from 'react';
import { Image, View } from 'react-native';

import { TILE_ASPECT_RATIO } from '../../constants';

import Thumbnail from './Thumbnail';
import {
    _groupThumbnailsByPages,
    _renderThumbnails
} from './commonGalleryViewGenerators';
import styles from './styles';

const ROW_COUNT = 3;

function constructTabletGalleryView(sortedParticipants, placeholderImageUrl, thumbnailDimensions, columnCount) {
    if (_.isNil(sortedParticipants) || _.isNil(thumbnailDimensions) || _.isNil(columnCount)) {
        return <View />;
    }

    const styleOverrides = {
        aspectRatio: TILE_ASPECT_RATIO,
        minHeight: thumbnailDimensions.height,
        maxWidth: thumbnailDimensions.width
    };

    const inFocusStyleOverrides = {
        ...styleOverrides,
        maxWidth: thumbnailDimensions?.width * 2.03
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

    console.log(`---------_getUserPages ${userGrid[0][0]}`);
    console.log(`---------_getUserPages ${userGrid[0][1]}`);
    console.log(`---------_getUserPages ${userGrid[0][2]}`);
    console.log(`---------_getUserPages ${userGrid[0].length}`);

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
                        style = { inFocusStyleOverrides } />
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
    const inFocusScale = 2;

    for (let i = 0; i < thumbnails.length; i += rowLength) {
        if (i < rowLength) {
            finalRows.push(
                        thumbnails.slice(i, i + rowLength - inFocusScale));
            i -= inFocusScale;
        } else {
            finalRows.push(thumbnails.slice(i, i + rowLength));
        }
    }

    return finalRows;
}

export default constructTabletGalleryView;
