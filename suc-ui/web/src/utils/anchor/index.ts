import * as display from './display';
import * as layout from './layout';
import * as nav from './nav';
import * as dataInput from './dataInput';

const anchorSets: { [key: string]: any } = {
    ...display,
    ...layout,
    ...nav,
    ...dataInput
};
export default anchorSets;
