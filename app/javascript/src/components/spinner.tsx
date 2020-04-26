import React from 'react';
import styled from 'styled-components';

// Fonts SVG come from FontAwesome Free Solid Icons
// https://fontawesome.com/license

interface IProps {
  readonly className?: string
}

const spinner = (props: IProps) => (
  <svg viewBox="0 0 512 512" className={props.className}>
    <path fill="currentColor" d='M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z' />
  </svg>
)

export const Spinner = styled(spinner)`
  width: 24px;
  height: 24px;
  color: black;
  animation: rotate 2s infinite linear;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`

export const LargeSpinner = styled(Spinner)`
  width: 96px;
  height: 96px;
  margin-left: 20vw;
  margin-top: 20vh;
`
