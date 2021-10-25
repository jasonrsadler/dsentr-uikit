import styled, { DefaultTheme } from 'styled-components'
import { space, typography, layout } from 'styled-system'
import getThemeValue from '../../util/getThemeValue'
import { TextProps } from './types'

interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, theme }: ThemedProps): string => {
  return getThemeValue(`colors.${color ?? 'none'}`, color)(theme)
}

const getFontSize = ({ fontSize, small }: TextProps): string => {
  return small != null ? '14px' : fontSize ?? '16px'
}

const Text = styled.div<TextProps>`
  color: ${getColor};
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold != null && bold ? 600 : 400)};
  line-height: 1.5;
  ${({ textTransform }) => textTransform != null && `text-transform: ${textTransform};`}
  ${({ ellipsis }) =>
    ellipsis != null &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}

  ${space}
  ${typography}
  ${layout}
`

Text.defaultProps = {
  color: 'text',
  small: false,
  ellipsis: false
}

export default Text
