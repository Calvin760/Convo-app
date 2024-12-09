import { View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

const ScreenWrapper = ({ children, bg }) => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 7 ? top + 5 : 30;

    return (
        <View style={{ flex: 1, backgroundColor: bg || '#fff', paddingTop }}>
            {children}
        </View>
    );
};

ScreenWrapper.propTypes = {
    children: PropTypes.node.isRequired, // Validate that children is a React node
    bg: PropTypes.string,               // Optional string for background color
};

ScreenWrapper.defaultProps = {
    bg: '#fff',                          // Default background color
};

export default ScreenWrapper;
