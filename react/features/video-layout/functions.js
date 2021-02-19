// @flow

declare var interfaceConfig: Object;


/**
 * Returns how many columns should be displayed in tile view. The number
 * returned will be between 1 and 5, inclusive.
 *
 * @returns {number}
 */
export function getMaxColumnCount() {
    const configuredMax = interfaceConfig.TILE_VIEW_MAX_COLUMNS || 5;

    return Math.min(Math.max(configuredMax, 1), 5);
}

/**
 * Returns the cell count dimensions for tile view. Tile view tries to uphold
 * equal count of tiles for height and width, until maxColumn is reached in
 * which rows will be added but no more columns.
 *
 * @param {Object} state - The redux store state.
 * @param {number} maxColumns - The maximum number of columns that can be
 * displayed.
 * @returns {Object} An object is return with the desired number of columns,
 * rows, and visible rows (the rest should overflow) for the tile view layout.
 */
export function getTileViewGridDimensions(state: Object, maxColumns: number = getMaxColumnCount()) {
    // When in tile view mode, we must discount ourselves (the local participant) because our
    // tile is not visible.
    const { iAmRecorder } = state['features/base/config'];
    const numberOfParticipants = state['features/base/participants'].length - (iAmRecorder ? 1 : 0);

    const columnsToMaintainASquare = Math.ceil(Math.sqrt(numberOfParticipants));
    const columns = Math.min(columnsToMaintainASquare, maxColumns);
    const rows = Math.ceil(numberOfParticipants / columns);
    const visibleRows = Math.min(maxColumns, rows);

    return {
        columns,
        visibleRows
    };
}

