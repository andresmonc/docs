import Highlight from 'prism-react-renderer';
import Prism from 'prismjs';
import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import fenceparser from 'fenceparser';
import rangeParser from 'parse-numeric-range';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  chakra,
  useClipboard,
  useColorModeValue
} from '@chakra-ui/react';
import {FiCheck, FiClipboard} from 'react-icons/fi';
import {colors} from '@apollo/space-kit/colors';
import {theme as darkTheme} from '../prism-themes/dark';
import {theme as lightTheme} from '../prism-themes/light';

// these must be imported after Prism
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-groovy';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

const CODE_BLOCK_SPACING = 4;
export const CodeBlockContext = createContext();
export const LineNumbersContext = createContext(true);

export default function CodeBlock({children}) {
  const defaultShowLineNumbers = useContext(LineNumbersContext);
  const [child] = Array.isArray(children) ? children : [children];
  const {
    className = 'language-text',
    children: innerChildren,
    metastring,
    'data-meta': dataMeta
  } = child.props;

  const meta = metastring || dataMeta;
  const {
    title,
    highlight,
    showLineNumbers = defaultShowLineNumbers
  } = meta ? fenceparser(meta) : {};
  const linesToHighlight = highlight
    ? rangeParser(Object.keys(highlight).toString())
    : [];

  const [code] = Array.isArray(innerChildren) ? innerChildren : [innerChildren];

  const {onCopy, hasCopied} = useClipboard(code);
  const theme = useColorModeValue(lightTheme, darkTheme);
  const highlightColor = useColorModeValue('gray.100', 'gray.700');
  const lineNumberColor = useColorModeValue(
    'gray.500',
    colors.midnight.lighter
  );
  const languageMenu = useContext(CodeBlockContext);

  return (
    <Highlight
      Prism={Prism}
      theme={theme}
      code={code.trim()}
      language={className.replace(/^language-/, '')}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => {
        // length of longest line number
        // ex. if there are 28 lines in the code block, lineNumberOffset = 2ch
        const lineNumberOffset = tokens.length.toString().length + 'ch';
        return (
          <Box
            rounded="md"
            style={style}
            pos="relative"
            borderWidth="1px"
            lineHeight="tall"
          >
            <Box fontSize="md" fontFamily="mono">
              {title && (
                <Box
                  px={CODE_BLOCK_SPACING}
                  py="2"
                  borderBottomWidth="1px"
                  borderTopRadius="md"
                >
                  {title}
                </Box>
              )}
              <Flex overflow="auto">
                <chakra.pre
                  d="inline-block"
                  className={className}
                  py={CODE_BLOCK_SPACING}
                  fontFamily="inherit"
                >
                  {tokens.map((line, i) => (
                    <Flex
                      key={i}
                      px={CODE_BLOCK_SPACING}
                      // for line highlighting to go all the way across code block
                      minW="full"
                      w="fit-content"
                      bg={linesToHighlight.includes(i + 1) && highlightColor}
                    >
                      {showLineNumbers && (
                        <Box
                          aria-hidden="true"
                          userSelect="none"
                          // line number alignment used in VS Code
                          textAlign="right"
                          w={lineNumberOffset}
                          mr={CODE_BLOCK_SPACING}
                          color={lineNumberColor}
                        >
                          {i + 1}
                        </Box>
                      )}
                      <Box
                        {...getLineProps({
                          line,
                          key: i
                        })}
                      >
                        <Box>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({token, key})} />
                          ))}
                        </Box>
                      </Box>
                    </Flex>
                  ))}
                </chakra.pre>
              </Flex>
            </Box>
            <ButtonGroup size="xs" pos="absolute" top="2" right="2">
              <Button
                leftIcon={hasCopied ? <FiCheck /> : <FiClipboard />}
                onClick={onCopy}
              >
                {hasCopied ? 'Copied!' : 'Copy'}
              </Button>
              {languageMenu}
            </ButtonGroup>
          </Box>
        );
      }}
    </Highlight>
  );
}

CodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};
