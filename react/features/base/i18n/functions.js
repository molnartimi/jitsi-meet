import { withTranslation } from 'react-i18next';

/**
 * Wraps a specific React Component in order to enable translations in it.
 *
 * @param {Component} component - The React Component to wrap.
 * @returns {Component} The React Component which wraps {@link component} and
 * enables translations in it.
 */
export function translate(component) {
    // Use the default list of namespaces.
    return withTranslation([ 'main', 'languages', 'countries' ])(component);
}
