import { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';

function RenderPropsTruncatedString({ text = '', threshold = 200, children, }) {
  const [isTruncated, setIsTruncated] = useState(true);
  const isTruncatable = useMemo(() => threshold < text.length, [threshold, text]);
  const truncatedText = useMemo(() => {
    if (!isTruncated || !isTruncatable) { return text; }
    return text.slice(0, threshold) + '...';
  }, [isTruncated, isTruncatable, text, threshold]);

  function toggleTruncate() {
    if (!isTruncatable) { return; }
    setIsTruncated(prevState => !prevState);
  }

  return children({
    truncatedText,
    isTruncated,
    isTruncatable,
    toggleTruncate,
  })
}

RenderPropsTruncatedString.propTypes = {
  text: PropTypes.string.isRequired,
  threshold: PropTypes.number,
};

export default memo(RenderPropsTruncatedString);
