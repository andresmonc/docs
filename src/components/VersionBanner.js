import PropTypes from 'prop-types';
import React from 'react';
import {Box, Link, useColorModeValue} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';

export default function VersionBanner({to, versionLabels}) {
  const bgColor = useColorModeValue('yellow.200', 'yellow.600');

  const [defaultVersionNumber, currentVersionNumber] = versionLabels.map(
    label => {
      // parse version number from label, i.e. "v2.6"
      const matches = label.match(/\d+.?\d*/g);
      return matches && parseFloat(matches[0]);
    }
  );

  return (
    <Box textAlign="center" py="3" px="4" bgColor={bgColor}>
      You&apos;re viewing documentation for{' '}
      {currentVersionNumber > defaultVersionNumber
        ? 'an upcoming'
        : 'a previous'}{' '}
      version of this software.{' '}
      <Link as={GatsbyLink} to={to} fontWeight="semibold">
        Switch to the latest stable version
      </Link>
    </Box>
  );
}

VersionBanner.propTypes = {
  to: PropTypes.string.isRequired,
  versionLabels: PropTypes.array.isRequired
};
