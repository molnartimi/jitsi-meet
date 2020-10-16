// @flow

import { NativeModules } from 'react-native';

import { getAppProp } from '../../base/app';

/**
 * Sends a specific event to the native counterpart of the External API. Native
 * apps may listen to such events via the mechanisms provided by the (native)
 * mobile Jitsi Meet SDK.
 *
 * @param {Object} store - The redux store.
 * @param {string} name - The name of the event to send.
 * @param {Object} data - The details/specifics of the event to send determined
 * by/associated with the specified {@code name}.
 * @returns {void}
 */
export function sendEvent(store: Object, name: string, data: Object) {
    // The JavaScript App needs to provide uniquely identifying information to
    // the native ExternalAPI module so that the latter may match the former to
    // the native view which hosts it.
    const externalAPIScope = getAppProp(store, 'externalAPIScope');

    externalAPIScope
        && NativeModules.ExternalAPI.sendEvent(name, data, externalAPIScope);
}

/**
 * (Source: https://github.com/douglascrockford/JSON-js/blob/master/cycle.js)
 *
 * Make a deep copy of an object or array, assuring that there is at most
 * one instance of each object or array in the resulting structure.
 * The duplicate references (which might be forming cycles) are replaced with
 * an object of the form {"$ref": PATH}
 * where the PATH is a JSONPath string that locates the first occurrence.
 *
 *      So,
 *          var a = [];
 *          a[0] = a;
 *          return decycleJSON(a);
 *      produces the object [{"$ref":"$"}].
 *
 * JSONPath is used to locate the unique object. $ indicates the top level of
 * the object or array. [NUMBER] or [STRING] indicates a child element or
 * property.
 *
 * @param {Object} object - Javascript object.
 * @returns {Object} - Javascript object without circle.
 */
export function decycleJSON(object) {
    const objects = new WeakMap();

    return (function derez(value, path) {
        // The derez function recurses through the object, producing the deep copy.

        let oldPath;
        let result;

        // typeof null === "object", so go on if this value is really an object but not
        // one of the weird builtin objects.

        if (
            typeof value === 'object'
            && value !== null
            && !(value instanceof Boolean)
            && !(value instanceof Date)
            && !(value instanceof Number)
            && !(value instanceof RegExp)
            && !(value instanceof String)
        ) {

            // If the value is an object or array, look to see if we have already
            // encountered it. If so, return a {"$ref":PATH} object. This uses an
            // ES6 WeakMap.

            oldPath = objects.get(value);
            if (oldPath !== undefined) {
                return { $ref: oldPath };
            }

            // Otherwise, accumulate the unique value and its path.

            objects.set(value, path);

            // If it is an array, replicate the array.

            if (Array.isArray(value)) {
                result = [];
                value.forEach((element, i) => {
                    result[i] = derez(element, `${path}[${i}]`);
                });
            } else {

                // If it is an object, replicate the object.

                result = {};
                Object.keys(value).forEach(name => {
                    result[name] = derez(
                        value[name],
                        `${path}[${JSON.stringify(name)}]`
                    );
                });
            }

            return result;
        }

        return value;
    })(object, '$');
}

/**
 * Restore an object that was reduced by decycleJSON.
 * Members whose values are objects of the form
 *        {$ref: PATH}
 * are replaced with references to the value found by the PATH.
 * This will restore cycles. The object will be mutated.
 *
 * The eval function is used to locate the values described by a PATH.
 * The root object is kept in a $ variable. A regular expression is used to
 * assure that the PATH is extremely well formed. The regexp contains nested * quantifiers.
 * That has been known to have extremely bad performance problems on some browsers for very long strings.
 * A PATH is expected to be reasonably short. A PATH is allowed to
 * belong to a very restricted subset of Goessner's JSONPath.
 *
 * So,
 *      var s = '[{"$ref":"$"}]';
 *      return retrocycleJSON(JSON.parse(s));
 * produces an array containing a single element which is the array itself.
 *
 * @param {Object} object - JSON object to retrocycle.
 * @returns {Object}
 */
export function retrocycleJSON(object) {
    const px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

    // The rez function walks recursively through the object looking for $ref
    // properties. When it finds one that has a value that is a path, then it
    // replaces the $ref object with a reference to the value that is found by
    // the path.
    (function rez(value) {

        if (value && typeof value === 'object') {
            if (Array.isArray(value)) {
                value.forEach((element, i) => {
                    if (typeof element === 'object' && element !== null) {
                        const path = element.$ref;

                        if (typeof path === 'string' && px.test(path)) {
                            value[i] = eval(path);
                        } else {
                            rez(element);
                        }
                    }
                });
            } else {
                Object.keys(value).forEach(name => {
                    const item = value[name];

                    if (typeof item === 'object' && item !== null) {
                        const path = item.$ref;

                        if (typeof path === 'string' && px.test(path)) {
                            value[name] = eval(path);
                        } else {
                            rez(item);
                        }
                    }
                });
            }
        }
    })(object);

    return object;
};
